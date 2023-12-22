package com.helpdesk; 

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;

public class NotificationChannels {

    public static final String DEFAULT_CHANNEL_ID = "default_channel_id";

    public static void create(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

            // Crie o canal de notificação
            NotificationChannel defaultChannel = new NotificationChannel(
                DEFAULT_CHANNEL_ID,
                "Channel Name",
                NotificationManager.IMPORTANCE_HIGH
            );
            defaultChannel.setDescription("Channel Description");
            defaultChannel.enableVibration(true);
            defaultChannel.setVibrationPattern(new long[]{100, 500}); // Padrão de vibração

            // Registre o canal na NotificationManager
            manager.createNotificationChannel(defaultChannel);
        }
    }
}