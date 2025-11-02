import protobuf from 'protobufjs';

export interface SensorDecoded {
  id: number;
  state: 'working' | 'offline' | 'clogged' | 'disabled';
  grains: number;
}

let SensorMessage: protobuf.Type | null = null;

/** Load and cache .proto schema once */
async function loadProto(): Promise<protobuf.Type> {
  if (SensorMessage) return SensorMessage;
  const root = await protobuf.load(require.resolve('./sensor.proto'));
  SensorMessage = root.lookupType('SensorMessage');
  return SensorMessage;
}

/** Decode binary protobuf buffer to sensor objects */
export async function decodeSensorBuffer(buf: ArrayBuffer): Promise<SensorDecoded[]> {
  const messageType = await loadProto();
  const decoded = messageType.decode(new Uint8Array(buf)) as any;
  const sensors = decoded.sensors ?? [];

  return sensors.map((s: any, i: number) => ({
    id: s.address || i + 1,
    state: mapStatusToState(s.status, s.online),
    grains: s.counter || 0,
  }));
}

/** Map numeric status to readable state */
function mapStatusToState(status?: number, online?: number): SensorDecoded['state'] {
  if (online === 0) return 'offline';
  switch (status) {
    case 1: return 'working';
    case 2: return 'clogged';
    case 3: return 'disabled';
    default: return 'working';
  }
}
