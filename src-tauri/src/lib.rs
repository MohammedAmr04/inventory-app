use std::process::{Child, Command, Stdio};
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::Manager;

struct ServerProcess(Mutex<Option<Child>>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .manage(ServerProcess(Mutex::new(None)))
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            let app_handle = app.handle().clone();
            std::thread::spawn(move || {
                if let Err(e) = start_server(&app_handle) {
                    eprintln!("[RetailX] Server error: {}", e);
                }
            });

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                kill_server_process(window);
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn start_server(app: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let resource_dir = app.path().resource_dir()?;
    let app_data = app.path().app_data_dir()?;
    std::fs::create_dir_all(&app_data)?;

    let server_dir = app_data.join("server");
    let db_path = app_data.join("retailx.db");
    let port = "3000";

    // Extract or copy server to app data if not already there
    if !server_dir.join("server.js").exists() {
        let tar_gz = resource_dir.join("server.tar.gz");
        if tar_gz.exists() {
            log::info!("Extracting server.tar.gz to {:?}", server_dir);
            extract_tar_gz(&tar_gz, &server_dir)?;
        } else {
            let server_src = resource_dir.join("server");
            if server_src.exists() {
                log::info!("Copying server to {:?}", server_dir);
                std::fs::create_dir_all(&server_dir)?;
                copy_dir_recursive(&server_src, &server_dir)?;
            } else {
                return Err("No server files found (server.tar.gz or server/)".into());
            }
        }
    }

    let node = find_node(&resource_dir)
        .ok_or_else(|| "Node.js not found — run scripts/download-node.mjs or install Node.js".to_string())?;

    #[cfg(windows)]
    let child = spawn_server_windows(&node, &server_dir, &db_path, port)?;
    #[cfg(not(windows))]
    let child = spawn_server_unix(&node, &server_dir, &db_path, port)?;

    if let Some(state) = app.try_state::<ServerProcess>() {
        *state.0.lock().unwrap() = Some(child);
    }

    log::info!("Server started on port {}", port);
    Ok(())
}

fn extract_tar_gz(tar_gz: &PathBuf, dest: &PathBuf) -> Result<(), Box<dyn std::error::Error>> {
    use std::fs::File;
    let file = File::open(tar_gz)?;
    let decoder = flate2::read::GzDecoder::new(file);
    let mut archive = tar::Archive::new(decoder);
    std::fs::create_dir_all(dest)?;
    archive.unpack(dest)?;
    Ok(())
}

fn copy_dir_recursive(src: &PathBuf, dst: &PathBuf) -> std::io::Result<()> {
    for entry in std::fs::read_dir(src)? {
        let entry = entry?;
        let file_type = entry.file_type()?;
        let src_path = entry.path();
        let rel = src_path.strip_prefix(src).unwrap();
        let dst_path = dst.join(rel);

        if file_type.is_dir() {
            std::fs::create_dir_all(&dst_path)?;
            copy_dir_recursive(&src_path.to_path_buf(), &dst_path)?;
        } else {
            let _ = std::fs::copy(&src_path, &dst_path);
        }
    }
    Ok(())
}

fn find_node(_resource_dir: &PathBuf) -> Option<PathBuf> {
    std::env::var_os("PATH").and_then(|paths| {
        std::env::split_paths(&paths).find_map(|dir| {
            let exe = dir.join("node.exe");
            if exe.exists() {
                return Some(exe);
            }
            let exe = dir.join("node");
            if exe.exists() {
                return Some(exe);
            }
            None
        })
    })
}

#[cfg(windows)]
fn spawn_server_windows(
    node: &PathBuf,
    server_dir: &PathBuf,
    db_path: &PathBuf,
    port: &str,
) -> Result<Child, Box<dyn std::error::Error>> {
    use std::os::windows::process::CommandExt;
    const CREATE_NO_WINDOW: u32 = 0x08000000;

    Ok(Command::new(node)
        .arg("server.js")
        .current_dir(server_dir)
        .env("PORT", port)
        .env("RETAILX_DB_PATH", db_path.to_str().unwrap())
        .env("NODE_ENV", "production")
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .creation_flags(CREATE_NO_WINDOW)
        .spawn()?)
}

#[cfg(not(windows))]
fn spawn_server_unix(
    node: &PathBuf,
    server_dir: &PathBuf,
    db_path: &PathBuf,
    port: &str,
) -> Result<Child, Box<dyn std::error::Error>> {
    Ok(Command::new(node)
        .arg("server.js")
        .current_dir(server_dir)
        .env("PORT", port)
        .env("RETAILX_DB_PATH", db_path.to_str().unwrap())
        .env("NODE_ENV", "production")
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()?)
}

fn kill_server_process(window: &tauri::Window) {
    if let Some(state) = window.try_state::<ServerProcess>() {
        if let Ok(mut guard) = state.0.lock() {
            if let Some(ref mut child) = *guard {
                let _ = child.kill();
                let _ = child.wait();
            }
        }
    }
}
