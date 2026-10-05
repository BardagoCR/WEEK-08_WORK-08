import { Device, sampleDevices, SensorData } from '../models/IoTModels';

// Replace these mock implementations with the backend client when the API is ready.
let mockDevices = sampleDevices.map((device) => ({ ...device }));

const delay = (milliseconds: number) =>
    new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds);
    });

const failureRate = 0.08;

const simulateFailure = () => {
    if (Math.random() < failureRate) {
        throw new Error('IoT request failed');
    }
};

export async function getSensorData(): Promise<SensorData> {
    await delay(1000);
    simulateFailure();

    return {
        temperature: 28 + Math.round(Math.random() * 4 - 2),
        humidity: 65 + Math.round(Math.random() * 6 - 3),
        lightLevel: 720 + Math.round(Math.random() * 120 - 60),
    };
}

export async function getDevices(): Promise<Device[]> {
    await delay(1000);
    simulateFailure();

    return mockDevices.map((device) => ({ ...device }));
}

export async function updateDeviceStatus(
    id: number,
    status: boolean,
): Promise<Device> {
    await delay(800);
    simulateFailure();

    const deviceIndex = mockDevices.findIndex((item) => item.id === id);

    if (deviceIndex === -1) {
        throw new Error('Device not found');
    }

    mockDevices[deviceIndex] = { ...mockDevices[deviceIndex], status };
    return { ...mockDevices[deviceIndex] };
}