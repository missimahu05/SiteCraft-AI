import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️  [MongoDB] Aucune URI MONGODB_URI dans les variables d\'environnement. Mode Fallback Mémoire actif.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB] Connecté avec succès : ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`⚠️ [MongoDB] Impossible de se connecter (${error.message}). Bascule en mode mémoire sans interruption.`);
    isConnected = false;
    return false;
  }
}

export function getDBStatus() {
  const state = mongoose.connection.readyState;
  return {
    connected: isConnected || state === 1,
    state: state === 1 ? 'connected' : state === 2 ? 'connecting' : 'disconnected',
    host: mongoose.connection.host || 'local_fallback',
    mode: (isConnected || state === 1) ? 'mongodb' : 'memory_fallback'
  };
}
