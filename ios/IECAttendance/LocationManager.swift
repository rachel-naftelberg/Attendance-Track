import Foundation
import CoreLocation
import Combine

struct Building: Codable, Identifiable, Hashable {
    let id: String
    let name: String
    let latitude: Double
    let longitude: Double
    let radius: Double // in meters
}

struct TravelTime: Codable, Hashable, Identifiable {
    var id: String {
        return cityName + "_" + siteId
    }
    let cityName: String
    let siteId: String
    let arrivalTimeMinutes: Int
    let returnTimeMinutes: Int
}

class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    @Published var authorizationStatus: CLAuthorizationStatus = .notDetermined
    @Published var lastLocation: CLLocation?
    @Published var currentMatchedBuilding: Building?
    @Published var buildings: [Building] = []
    @Published var travelTimes: [TravelTime] = []
    @Published var cities: [String] = ["חיפה", "תל אביב", "חדרה", "אשדוד", "אשקלון"]
    
    private var documentsDirectory: URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    }
    
    private var buildingsFileURL: URL {
        documentsDirectory.appendingPathComponent("buildings.json")
    }
    
    private var travelTimesFileURL: URL {
        documentsDirectory.appendingPathComponent("travel_times.json")
    }
    
    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        self.authorizationStatus = locationManager.authorizationStatus
        loadBuildings()
        loadTravelTimes()
    }
    
    private func loadBuildings() {
        let fileURL = buildingsFileURL
        
        // Copy from bundle if not exists in Documents directory
        if !FileManager.default.fileExists(atPath: fileURL.path) {
            if let bundleURL = Bundle.main.url(forResource: "buildings", withExtension: "json") {
                do {
                    try FileManager.default.copyItem(at: bundleURL, to: fileURL)
                    print("Copied buildings.json to Documents directory")
                } catch {
                    print("Error copying buildings.json to Documents: \(error)")
                }
            }
        }
        
        do {
            let data = try Data(contentsOf: fileURL)
            let decoder = JSONDecoder()
            self.buildings = try decoder.decode([Building].self, from: data)
            print("Loaded \(buildings.count) buildings from Documents")
        } catch {
            print("Error loading or decoding buildings from Documents: \(error)")
        }
    }
    
    private func loadTravelTimes() {
        let fileURL = travelTimesFileURL
        
        // Copy from bundle if not exists in Documents directory
        if !FileManager.default.fileExists(atPath: fileURL.path) {
            if let bundleURL = Bundle.main.url(forResource: "travel_times", withExtension: "json") {
                do {
                    try FileManager.default.copyItem(at: bundleURL, to: fileURL)
                    print("Copied travel_times.json to Documents directory")
                } catch {
                    print("Error copying travel_times.json to Documents: \(error)")
                }
            }
        }
        
        do {
            let data = try Data(contentsOf: fileURL)
            let decoder = JSONDecoder()
            self.travelTimes = try decoder.decode([TravelTime].self, from: data)
            print("Loaded \(travelTimes.count) travel times from Documents")
        } catch {
            print("Error loading or decoding travel_times from Documents: \(error)")
        }
    }
    
    func saveBuildings() {
        do {
            let encoder = JSONEncoder()
            encoder.outputFormatting = .prettyPrinted
            let data = try encoder.encode(buildings)
            try data.write(to: buildingsFileURL)
            print("Successfully saved buildings to Documents")
        } catch {
            print("Error saving buildings to Documents: \(error)")
        }
    }
    
    func saveTravelTimes() {
        do {
            let encoder = JSONEncoder()
            encoder.outputFormatting = .prettyPrinted
            let data = try encoder.encode(travelTimes)
            try data.write(to: travelTimesFileURL)
            print("Successfully saved travel times to Documents")
        } catch {
            print("Error saving travel times to Documents: \(error)")
        }
    }
    
    // UI Database Editing Methods
    func updateTravelTime(city: String, siteId: String, arrivalMinutes: Int, returnMinutes: Int) {
        if let idx = travelTimes.firstIndex(where: { $0.cityName == city && $0.siteId == siteId }) {
            // Edit existing
            let updated = TravelTime(cityName: city, siteId: siteId, arrivalTimeMinutes: arrivalMinutes, returnTimeMinutes: returnMinutes)
            travelTimes[idx] = updated
        } else {
            // Add new
            let newRecord = TravelTime(cityName: city, siteId: siteId, arrivalTimeMinutes: arrivalMinutes, returnTimeMinutes: returnMinutes)
            travelTimes.append(newRecord)
        }
        saveTravelTimes()
    }
    
    func deleteTravelTime(at offsets: IndexSet) {
        travelTimes.remove(atOffsets: offsets)
        saveTravelTimes()
    }
    
    func updateBuilding(id: String, name: String, latitude: Double, longitude: Double, radius: Double) {
        if let idx = buildings.firstIndex(where: { $0.id == id }) {
            let updated = Building(id: id, name: name, latitude: latitude, longitude: longitude, radius: radius)
            buildings[idx] = updated
        } else {
            let newBuilding = Building(id: id, name: name, latitude: latitude, longitude: longitude, radius: radius)
            buildings.append(newBuilding)
        }
        saveBuildings()
    }
    
    func deleteBuilding(id: String) {
        if let idx = buildings.firstIndex(where: { $0.id == id }) {
            buildings.remove(at: idx)
            saveBuildings()
            
            // Clean up travel times associated with this site
            travelTimes.removeAll(where: { $0.siteId == id })
            saveTravelTimes()
        }
    }
    
    func requestLocationPermission() {
        guard UserDefaults.standard.object(forKey: "iec_pref_gps_approved") as? Bool ?? true else { return }
        locationManager.requestWhenInUseAuthorization()
    }
    
    func startUpdatingLocation() {
        guard UserDefaults.standard.object(forKey: "iec_pref_gps_approved") as? Bool ?? true else { return }
        locationManager.startUpdatingLocation()
    }
    
    func stopUpdatingLocation() {
        locationManager.stopUpdatingLocation()
    }
    
    func updateGPSEnabledStatus() {
        let approved = UserDefaults.standard.object(forKey: "iec_pref_gps_approved") as? Bool ?? true
        if !approved {
            stopUpdatingLocation()
            self.lastLocation = nil
            self.currentMatchedBuilding = nil
        } else {
            if authorizationStatus == .authorizedWhenInUse || authorizationStatus == .authorizedAlways {
                startUpdatingLocation()
            } else {
                requestLocationPermission()
            }
        }
    }
    
    // CoreLocation delegate methods
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        self.authorizationStatus = manager.authorizationStatus
        let approved = UserDefaults.standard.object(forKey: "iec_pref_gps_approved") as? Bool ?? true
        if approved && (manager.authorizationStatus == .authorizedWhenInUse || manager.authorizationStatus == .authorizedAlways) {
            locationManager.startUpdatingLocation()
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard UserDefaults.standard.object(forKey: "iec_pref_gps_approved") as? Bool ?? true else {
            self.lastLocation = nil
            self.currentMatchedBuilding = nil
            return
        }
        guard let location = locations.last else { return }
        self.lastLocation = location
        self.currentMatchedBuilding = findMatchingBuilding(for: location)
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Location manager failed: \(error.localizedDescription)")
    }
    
    private func findMatchingBuilding(for location: CLLocation) -> Building? {
        for building in buildings {
            let buildingLocation = CLLocation(latitude: building.latitude, longitude: building.longitude)
            let distance = location.distance(from: buildingLocation)
            
            if distance <= building.radius {
                return building
            }
        }
        return nil
    }
}
