import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { getDropOffLocations } from "@/api/dropOffLocation";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { DropOffLocation } from "@/types/dropOffLocation";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function PingDropOffLocation() {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const webViewRef = useRef<WebView>(null);

  const [region, setRegion] = useState<Region>({
    latitude: 13.727294, // Updated to the fixed current location
    longitude: 100.77233, // Updated to the fixed current location
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [selectedLocation, setSelectedLocation] =
    useState<DropOffLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoadingMessage, setLocationLoadingMessage] = useState(
    "Finding your current location..."
  );
  const [dropOffLocations, setDropOffLocations] = useState<DropOffLocation[]>(
    []
  );
  const [isLoadingDropOffLocations, setIsLoadingDropOffLocations] =
    useState(true);

  useEffect(() => {
    // Fetch drop-off locations
    const fetchDropOffLocations = async () => {
      try {
        setIsLoadingDropOffLocations(true);
        const locations = await getDropOffLocations();
        setDropOffLocations(locations);
      } catch (error) {
        // Error handled silently
      } finally {
        setIsLoadingDropOffLocations(false);
      }
    };

    fetchDropOffLocations();

    // getCurrentLocation();

    // Animate the bottom sheet in
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      setLocationError(null);
      setLocationLoadingMessage("Getting your location...");

      // Use fixed coordinates for current location
      const fixedLatitude = 13.727294;
      const fixedLongitude = 100.77233;

      // Simulate a short delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newRegion = {
        latitude: fixedLatitude,
        longitude: fixedLongitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
      // setSelectedLocation({
      //   latitude: fixedLatitude,
      //   longitude: fixedLongitude,
      //   address: "Current Location",
      //   imageUrl: undefined,
      // });

      // Update WebView map
      if (webViewRef.current) {
        webViewRef.current.postMessage(
          JSON.stringify({
            type: "updateLocation",
            latitude: fixedLatitude,
            longitude: fixedLongitude,
            isCurrentLocation: true,
            address: "Current Location",
          })
        );
      }

      setIsLoadingLocation(false);
    } catch (error) {
      setLocationError("Failed to get current location");
      setIsLoadingLocation(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      router.push({
        pathname: "/(pages)/summaryOrder",
        params: {
          dropOffLocationId: selectedLocation.dropoff_id,
          dropOffLocationName: selectedLocation.name,
          dropOffLocationDetail: selectedLocation.detail,
        },
      });
    } else {
      Alert.alert(
        "Please select a drop-off location",
        "Please tap on one of the blue markers on the map to select a drop-off location."
      );
    }
  };

  const myLocationHandler = async () => {
    await getCurrentLocation();
  };

  // HTML template for the map - regenerate when region changes
  const mapHtml = useMemo(
    () => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Location Picker</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
            body, html { margin: 0; padding: 0; height: 100%; }
            #map { height: 100vh; width: 100%; }
            .current-location-marker {
                background-color: #007AFF;
                border: 3px solid white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                box-shadow: 0 0 10px rgba(0, 122, 255, 0.5);
            }
            
            /* Custom popup styling */
            .leaflet-popup-content-wrapper {
                background: transparent !important;
                border-radius: 12px !important;
                box-shadow: none !important;
                padding: 0 !important;
                animation: popupSlideIn 0.3s ease-out !important;
            }
            
            @keyframes popupSlideIn {
                0% {
                    opacity: 0;
                    transform: translateY(-10px) scale(0.95);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .leaflet-popup-content {
                margin: 0 !important;
                padding: 0 !important;
                border-radius: 12px !important;
                overflow: hidden !important;
            }
            
            .leaflet-popup-tip {
                background: white !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
            }
            
            .leaflet-popup-close-button {
                background: rgba(0,0,0,0.1) !important;
                border-radius: 50% !important;
                width: 24px !important;
                height: 24px !important;
                font-size: 14px !important;
                font-weight: bold !important;
                color: white !important;
                text-shadow: none !important;
                line-height: 22px !important;
                top: 8px !important;
                right: 8px !important;
                transition: all 0.2s ease !important;
            }
            
            .leaflet-popup-close-button:hover {
                background: rgba(0,0,0,0.2) !important;
                transform: scale(1.1) !important;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
            var map = L.map('map').setView([${region.latitude}, ${region.longitude}], 15);
            var marker = null;
            var currentLocationMarker = null;
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            // Custom icon for current location
            var currentLocationIcon = L.divIcon({
                className: 'current-location-marker',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            
            // Custom icon for selected location
            var selectedLocationIcon = L.icon({
                iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E96D6D"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });
            
            // Add current location marker if available
            
            
            // Add drop-off location markers
            var dropOffIcon = L.icon({
                iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4A90E2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
                iconSize: [28, 28],
                iconAnchor: [14, 28],
                popupAnchor: [0, -28]
            });
            
            ${dropOffLocations
              .map(
                (location) => `
            L.marker([${parseFloat(location.latitude)}, ${parseFloat(location.longitude)}], {icon: dropOffIcon})
                .addTo(map)
                .bindPopup(\`
                    <div style="
                        max-width: 250px; 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                        border-radius: 12px;
                        padding: 0;
                        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                        border: 1px solid rgba(0,0,0,0.05);
                        overflow: hidden;
                    ">
                        <div style="position: relative;">
                            <img src="${location.image_url}" 
                                 style="
                                     width: 100%; 
                                     height: 120px; 
                                     object-fit: cover; 
                                     border-radius: 0;
                                     display: block;
                                 " 
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                            <div style="
                                display: none;
                                width: 100%;
                                height: 120px;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                position: relative;
                            ">
                                <div style="
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    color: white;
                                    font-size: 24px;
                                    font-weight: bold;
                                ">📍</div>
                            </div>
                        </div>
                        <div style="padding: 16px;">
                            <h3 style="
                                margin: 0 0 8px 0;
                                font-size: 16px;
                                font-weight: 600;
                                color: #1a202c;
                                line-height: 1.3;
                            ">${location.name}</h3>
                            <p style="
                                margin: 0 0 8px 0;
                                font-size: 14px;
                                color: #4a5568;
                                line-height: 1.4;
                            ">${location.detail}</p>

                        </div>
                    </div>
                \`)
                .on('click', function() {
                    // Zoom to maximum level when marker is clicked
                    map.setView([${parseFloat(location.latitude)}, ${parseFloat(location.longitude)}], 18, {
                        animate: true,
                        duration: 0.5
                    });
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'dropOffLocationSelected',
                        dropoff_id: '${location.dropoff_id}',
                        latitude: ${parseFloat(location.latitude)},
                        longitude: ${parseFloat(location.longitude)},
                        name: '${location.name}',
                        detail: '${location.detail}',
                        imageUrl: '${location.image_url}'
                    }));
                });`
              )
              .join("")}
            
            // Handle location updates from React Native
            window.addEventListener('message', function(event) {
                if (event.data) {
                    try {
                        var data = JSON.parse(event.data);
                        if (data.type === 'updateLocation') {
                            // Validate coordinates
                            if (isNaN(data.latitude) || isNaN(data.longitude) || 
                                data.latitude < -90 || data.latitude > 90 || 
                                data.longitude < -180 || data.longitude > 180) {
                                return;
                            }
                            
                            map.setView([data.latitude, data.longitude], 16);
                            
                            // Remove existing markers
                            if (marker) {
                                map.removeLayer(marker);
                                marker = null;
                            }
                            if (currentLocationMarker) {
                                map.removeLayer(currentLocationMarker);
                                currentLocationMarker = null;
                            }
                            
                            // Add appropriate marker
                            if (data.isCurrentLocation) {
                                currentLocationMarker = L.marker([data.latitude, data.longitude], {icon: currentLocationIcon})
                                    .addTo(map)
                                    .bindPopup('Current Location', {closeButton: false, autoClose: false, closeOnClick: false});
                                // Disable click events on current location marker
                                currentLocationMarker.off('click');
                            } else {
                                marker = L.marker([data.latitude, data.longitude], {icon: selectedLocationIcon})
                                    .addTo(map)
                                    .bindPopup(data.address || 'Selected Location');
                            }
                        }
                    } catch (e) {
                        // Error handled silently
                    }
                }
            });
        </script>
    </body>
    </html>
  `,
    [region, dropOffLocations]
  );
  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "dropOffLocationSelected") {
        // Handle drop-off location selection
        setSelectedLocation({
          dropoff_id: data.dropoff_id,
          latitude: data.latitude.toString(),
          longitude: data.longitude.toString(),
          name: data.name,
          detail: data.detail,
          image_url: data.imageUrl,
        });

        // Don't update region to prevent map re-rendering when clicking markers
        // setRegion((prev) => ({
        //   ...prev,
        //   latitude: data.latitude,
        //   longitude: data.longitude,
        // }));
      }
    } catch (error) {
      // Error handled silently
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Location Status Indicator */}
      {isLoadingLocation && (
        <View style={styles.locationStatusContainer}>
          <MaterialIcons
            name="location-searching"
            size={16}
            color={Colors.primary}
          />
          <ThemedText style={styles.locationStatusText}>
            {locationLoadingMessage}
          </ThemedText>
        </View>
      )}

      {locationError && (
        <View style={styles.locationErrorContainer}>
          <MaterialIcons name="location-off" size={16} color={Colors.red} />
          <ThemedText style={styles.locationErrorText}>
            {locationError}
          </ThemedText>
        </View>
      )}

      {/* Map Container - Full screen */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: mapHtml }}
          style={styles.map}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />

        {/* Floating Action Buttons */}
        <View style={styles.floatingButtons}>
          {/* My Location Button */}
          <Pressable
            style={[
              styles.locationButton,
              isLoadingLocation && styles.locationButtonLoading,
            ]}
            onPress={myLocationHandler}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
              <MaterialIcons name="refresh" size={24} color={Colors.gray1} />
            ) : (
              <MaterialIcons
                name="my-location"
                size={24}
                color={Colors.primary}
              />
            )}
          </Pressable>
        </View>
      </View>

      {/* Bottom Confirmation Panel */}
      <SafeAreaView style={styles.bottomSafeArea} edges={["bottom"]}>
        <Animated.View
          style={[
            styles.bottomPanel,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {selectedLocation && (
            <View style={styles.selectedLocationInfo}>
              <View style={styles.locationHeader}>
                <View style={styles.locationIconContainer}>
                  <MaterialIcons
                    name="location-on"
                    size={24}
                    color={Colors.white}
                  />
                </View>
                <View style={styles.locationHeaderText}>
                  <ThemedText style={styles.locationTitle}>
                    {selectedLocation.name || "Selected Location"}
                  </ThemedText>
                </View>
              </View>

              {selectedLocation.image_url ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: selectedLocation.image_url }}
                    style={styles.locationImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.3)"]}
                    style={styles.imageOverlay}
                  />
                </View>
              ) : (
                <View style={styles.defaultLocationContainer}>
                  <LinearGradient
                    colors={["#667eea", "#764ba2"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.defaultLocationGradient}
                  >
                    <ThemedText style={styles.defaultLocationEmoji}>
                      🏫
                    </ThemedText>
                  </LinearGradient>
                  <ThemedText style={styles.locationSubtitle}>
                    สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง กรุงเทพมหานคร
                    กรุงเทพฯ 10520, ประเทศไทย
                  </ThemedText>
                </View>
              )}
            </View>
          )}

          <View style={styles.confirmButtonContainer}>
            <ThemedButton
              title="ยืนยันตำแหน่ง"
              onPress={handleConfirm}
              variant="primary"
              style={styles.confirmButton}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray2,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  searchBar: {
    flex: 1,
    marginRight: 12,
  },
  userAvatarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  settingsIcon: {
    padding: 4,
  },
  suggestionsContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
    zIndex: 1000,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray2,
  },
  suggestionText: {
    marginLeft: 12,
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.black,
  },
  suggestionSubtitle: {
    fontSize: 14,
    color: Colors.gray1,
    marginTop: 2,
  },
  mapContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  floatingButtons: {
    position: "absolute",
    right: 16,
    top: 60, // Moved down to account for status bar
  },
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
  },
  locationButtonLoading: {
    opacity: 0.6,
    backgroundColor: Colors.gray2,
  },
  storeMarkers: {
    position: "absolute",
    top: 100,
    right: 0,
    left: -200,
  },
  bottomSafeArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white, // Fill swipe gesture area with white
  },
  bottomPanel: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 0, // Remove bottom padding as SafeAreaView handles it
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectedLocationInfo: {
    flexDirection: "column",
    marginBottom: 20,
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationHeaderText: {
    flex: 1,
    marginLeft: 16,
  },
  locationIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  locationDetails: {
    marginLeft: 16,
    flex: 1,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.black,
    lineHeight: 24,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
  },
  locationImage: {
    width: "100%",
    height: 180,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  defaultLocationContainer: {
    marginTop: 8,
  },
  defaultLocationGradient: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  defaultLocationEmoji: {
    fontSize: 32,
    color: Colors.white,
  },
  locationSubtitle: {
    fontSize: 14,
    color: Colors.gray1,
    lineHeight: 20,
    textAlign: "center",
  },
  confirmButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  confirmButton: {
    width: "100%",
  },
  locationStatusContainer: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.cream,
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationStatusText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 8,
  },
  locationErrorContainer: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFE6E6",
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationErrorText: {
    fontSize: 14,
    color: Colors.red,
    marginLeft: 8,
  },
});
