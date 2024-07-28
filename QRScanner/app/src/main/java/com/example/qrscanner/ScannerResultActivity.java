package com.example.qrscanner;

import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class ScannerResultActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scanner_result);

        String data = getIntent().getStringExtra("data");
        String[] details = data.split(", ");

        ((TextView) findViewById(R.id.tv_id)).setText(details[0]);
        ((TextView) findViewById(R.id.tv_name)).setText(details[1]);
        ((TextView) findViewById(R.id.tv_email)).setText(details[2]);
        ((TextView) findViewById(R.id.tv_phone)).setText(details[3]);
        ((TextView) findViewById(R.id.tv_whatsapp)).setText(details[4]);
        ((TextView) findViewById(R.id.tv_year)).setText(details[5]);
        ((TextView) findViewById(R.id.tv_meal)).setText(details[6]);
        ((TextView) findViewById(R.id.tv_transaction_id)).setText(details[7]);
    }
}