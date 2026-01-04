import { Client } from 'colyseus.js';

// Colyseus client instance
let client = null;

export const initializeColyseusClient = () => {
  if (!client) {
    // Use environment variable or default to localhost
    const serverUrl = process.env.NEXT_PUBLIC_COLYSEUS_SERVER_URL || 'ws://localhost:2567';
    client = new Client(serverUrl);
  }
  return client;
};

export const joinBattleRoom = async (battleId = null) => {
  try {
    const colyseusClient = initializeColyseusClient();
    
    // Join or create a battle room
    const room = battleId 
      ? await colyseusClient.join('battle', { battleId })
      : await colyseusClient.create('battle');
    
    return room;
  } catch (error) {
    console.error('Error joining battle room:', error);
    throw error;
  }
};

export default initializeColyseusClient;