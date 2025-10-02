#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod telemetry; // on déclare le module telemetry

use tauri::AppHandle;

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle: AppHandle = app.handle().clone();
            // lance notre listener UDP dans un thread async
            tauri::async_runtime::spawn(telemetry::udp_listener::start_udp_listener(app_handle));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
