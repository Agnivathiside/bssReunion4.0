package com.example.qrscanner;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.journeyapps.barcodescanner.BarcodeCallback;
import com.journeyapps.barcodescanner.BarcodeResult;
import com.journeyapps.barcodescanner.DecoratedBarcodeView;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    private static final String ENCRYPTION_KEY = "7309d3a5529eb8c31f66c89e0b0b6fd5c07b13bc0502f16d0b48d1d3bf0cef1a";
    private static final int CAMERA_REQUEST_CODE = 100;
    private DecoratedBarcodeView barcodeScannerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        barcodeScannerView = findViewById(R.id.zxing_barcode_scanner);

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, CAMERA_REQUEST_CODE);
        } else {
            startScanning();
        }
    }

    private void startScanning() {
        barcodeScannerView.resume();
        barcodeScannerView.decodeContinuous(new BarcodeCallback() {
            @Override
            public void barcodeResult(BarcodeResult result) {
                if (result.getText() != null) {
                    barcodeScannerView.pause();
                    String decryptedData = decrypt(result.getText());
                    if (decryptedData != null) {
                        Intent intent = new Intent(MainActivity.this, ScannerResultActivity.class);
                        intent.putExtra("data", decryptedData);
                        startActivity(intent);
                    } else {
                        Toast.makeText(MainActivity.this, "Failed to decrypt QR code", Toast.LENGTH_SHORT).show();
                        barcodeScannerView.resume();
                    }
                }
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == CAMERA_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startScanning();
            } else {
                Toast.makeText(this, "Camera permission is required to use the scanner", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private String decrypt(String encryptedText) {
        try {
            Log.d(TAG, "Encrypted text: " + encryptedText);
            String[] parts = encryptedText.split(":");
            if (parts.length != 2) {
                Log.e(TAG, "Invalid encrypted text format");
                return null;
            }

            byte[] iv = hexStringToByteArray(parts[0]);
            byte[] encrypted = hexStringToByteArray(parts[1]);

            SecretKeySpec secretKeySpec = new SecretKeySpec(hexStringToByteArray(ENCRYPTION_KEY), "AES");
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, new IvParameterSpec(iv));
            byte[] decrypted = cipher.doFinal(encrypted);

            String decryptedText = new String(decrypted, StandardCharsets.UTF_8);
            Log.d(TAG, "Decrypted text: " + decryptedText);

            return decryptedText;
        } catch (Exception e) {
            Log.e(TAG, "Decryption error", e);
            return null;
        }
    }

    private byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i + 1), 16));
        }
        return data;
    }
}
