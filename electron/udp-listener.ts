import dgram from 'node:dgram';
import type { BrowserWindow } from 'electron';
import * as F1ParserModule from '@deltazeroproduction/f1-udp-parser';

type SpeedListenerCleanup = () => void;

interface CarTelemetryPacket {
  m_header?: {
    m_packetId?: number;
  };
  m_carTelemetryData?: Array<{
    m_speed?: number;
  }>;
}

const CAR_TELEMETRY_PACKET_ID = 6;
const UDP_PORT = 20777;
const UDP_HOST = '0.0.0.0';

const ParserConstructor: new () => any =
  (F1ParserModule as { F1Parser?: new () => any }).F1Parser ??
  (F1ParserModule as { default?: new () => any }).default ??
  (F1ParserModule as unknown as new () => any);

export const startUdpListener = (win: BrowserWindow): SpeedListenerCleanup => {
  const socket = dgram.createSocket('udp4');
  const parser: any = new ParserConstructor();

  const forwardSpeed = (speed: number) => {
    if (!win.isDestroyed()) {
      win.webContents.send('telemetry:speed', speed);
    }
  };

  socket.on('message', (message) => {
    try {
      const packet: CarTelemetryPacket | undefined =
        typeof parser.fromBuffer === 'function'
          ? parser.fromBuffer(message)
          : typeof parser.parseBuffer === 'function'
          ? parser.parseBuffer(message)
          : typeof parser.parse === 'function'
          ? parser.parse(message)
          : undefined;

      if (packet?.m_header?.m_packetId === CAR_TELEMETRY_PACKET_ID) {
        const speed = packet.m_carTelemetryData?.[0]?.m_speed;
        if (typeof speed === 'number' && !Number.isNaN(speed)) {
          forwardSpeed(speed);
        }
      }
    } catch (error) {
      console.error('[UDP Listener] Failed to parse telemetry packet', error);
    }
  });

  socket.on('error', (error) => {
    console.error('[UDP Listener] Socket error', error);
  });

  socket.bind(UDP_PORT, UDP_HOST, () => {
    console.log(`[UDP Listener] Listening on ${UDP_HOST}:${UDP_PORT}`);
  });

  const cleanup = () => {
    socket.removeAllListeners();
    try {
      socket.close();
    } catch (error) {
      console.error('[UDP Listener] Failed to close socket', error);
    }
  };

  win.once('closed', cleanup);

  return cleanup;
};
