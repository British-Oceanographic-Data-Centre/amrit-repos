import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class QrCodeScanner extends StatefulWidget {
  const QrCodeScanner({super.key});

  @override
  State<QrCodeScanner> createState() => _QrState();
}

class _QrState extends State<QrCodeScanner> {
  final MobileScannerController controller = MobileScannerController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: MobileScanner(
        controller: controller,
        onDetect: (BarcodeCapture capture) {
          final List<Barcode> barcodes = capture.barcodes;
          var isDialogVisible = false;

          if (barcodes.isNotEmpty && !isDialogVisible) {
            isDialogVisible = true;
            showDialog<String>(
              context: context,
              builder: (BuildContext context) => AlertDialog(
                content: Text(barcodes[0].rawValue!),
                actions: <Widget>[
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context, AppLocalizations.of(context)!.ok);
                      isDialogVisible = false;
                    },
                    child: Text(AppLocalizations.of(context)!.dismiss),
                  ),
                ],
              ),
            );
          }
        },
      )
    );
  }
}
