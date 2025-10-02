use f1_game_library_models_25::telemetry_data::F1Data;
use tauri::{AppHandle, Emitter};
use tokio::net::UdpSocket;

pub async fn start_udp_listener(app_handle: AppHandle) {
    // On ouvre un socket UDP sur le port 20777 (par défaut dans F1 25)
    let socket = UdpSocket::bind("0.0.0.0:20777")
        .await
        .expect("Could not bind to port 20777");

    // Buffer de 2048 octets pour stocker les paquets UDP
    let mut buf = [0u8; 2048];

    loop {
        // On reçoit un paquet UDP
        let (len, _) = socket.recv_from(&mut buf).await.unwrap();

        // On essaie de désérialiser en structure F1Data
        if let Ok(packet) =
            f1_game_library_models_25::deserialise_udp_packet_from_bytes(&buf[..len])
        {
            match packet {
                F1Data::TelemetryData(data) => {
                    // On prend la première voiture (player)
                    if let Some(car) = data.telemetry_data.first() {
                        // On envoie l’événement "telemetry:update" au front
                        app_handle.emit("telemetry:update", car).unwrap();
                    }
                }
                F1Data::LapData(data) => {
                    // On envoie les infos de tour au front
                    app_handle.emit("telemetry:lap", data).unwrap();
                }
                _ => {}
            }
        }
    }
}
