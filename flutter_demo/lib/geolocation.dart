// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class GeolocationPage extends StatefulWidget {
  const GeolocationPage({super.key});

  @override
  State<GeolocationPage> createState() => _GeolocationState();
}

class _GeolocationState extends State<GeolocationPage> {
  Position? _position;
  void _getCurrentLocation() async {
    Position position = await _determinePosition();
    setState(() {
      _position = position;
    });
  }

  Future<Position> _determinePosition() async {
    LocationPermission permission;
    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        // Permissions are denied, next time you could try
        // requesting permissions again (this is also where
        // Android's shouldShowRequestPermissionRationale
        // returned true. According to Android guidelines
        // your App should show an explanatory UI now.
        return Future.error(AppLocalizations.of(context)!.locationPermissionDenied);
      }
    }
    if (permission == LocationPermission.deniedForever) {
      // Permissions are denied forever, handle appropriately.
      return Future.error(AppLocalizations.of(context)!.locationPermissionBlocked);
    }
    // When we reach here, permissions are granted and we can
    // continue accessing the position of the device.
    return await Geolocator.getCurrentPosition();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          TextButton(
            onPressed: _getCurrentLocation,
            child: Text(AppLocalizations.of(context)!.showLocationButton),
          ),
          Text(_position != null ? AppLocalizations.of(context)!.currentLocation(_position!.latitude, _position!.longitude): '')
        ],
      ),
    );
  }
}
