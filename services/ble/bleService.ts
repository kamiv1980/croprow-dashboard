import { useSensorsStore } from '@/store/useSensorsStore';
import { decodeSensorBuffer } from '../protobuf/decodeSensorData';
import protobuf from 'protobufjs';

let intervalHandle: any = null;
let SensorMessage: protobuf.Type | null = null;

async function getMessageType(): Promise<protobuf.Type> {
  if (SensorMessage) return SensorMessage;
  const root = await protobuf.load(require.resolve('../protobuf/sensor.proto'));
  SensorMessage = root.lookupType('SensorMessage');
  return SensorMessage;
}

/** Мок-стрим BLE: кодирует protobuf-пакеты и декодирует их обратно */
export function bleMockStart() {
  const setSensors = useSensorsStore.getState().setSensors;

  const start = async () => {
    const msgType = await getMessageType();
    const makeBuffer = () => {
      const sensors = Array.from({ length: 8 }).map((_, i) => ({
        address: i + 1,
        online: Math.random() > 0.1 ? 1 : 0,
        counter: Math.round(Math.random() * 200),
        counter_a: Math.round(Math.random() * 100),
        status: randomStatus(),
      }));
      const payload = msgType.create({ sensors });
      return msgType.encode(payload).finish().buffer;
    };

    const sendMock = async () => {
      const buf = makeBuffer();
      const decoded = await decodeSensorBuffer(buf);
      setSensors(decoded);
    };

    await sendMock();
    intervalHandle = setInterval(sendMock, 1500);
  };

  start();
  return () => {
    if (intervalHandle) clearInterval(intervalHandle);
  };
}

function randomStatus() {
  const r = Math.random();
  if (r < 0.7) return 1; // working
  if (r < 0.9) return 2; // clogged
  return 3; // disabled/offline
}

export default { bleMockStart };
