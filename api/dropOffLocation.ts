import { DropOffLocation } from "@/types/dropOffLocation";
import axios from "axios";
import EXPO_API from "./url";

/**
 * Fetch all available drop-off locations
 * @returns Promise<DropOffLocation[]> Array of drop-off locations
 */
export const getDropOffLocations = async (): Promise<DropOffLocation[]> => {
  try {
    const response = await axios.get<DropOffLocation[]>(
      `${EXPO_API}/v1/dropOff/`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
