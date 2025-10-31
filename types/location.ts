export interface LocationCoordinate {
  latitude: number;
  longitude: number;
}

export interface LocationSuggestion {
  id: string;
  title: string;
  subtitle?: string;
  coordinate: LocationCoordinate;
}

export interface SelectedLocation extends LocationCoordinate {
  address?: string;
}

export interface MapRegion extends LocationCoordinate {
  latitudeDelta: number;
  longitudeDelta: number;
}
