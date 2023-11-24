import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // Lógica para manipular a mensagem recebida
        // Este método é chamado quando uma mensagem é recebida enquanto o aplicativo está em primeiro plano
    }
}
