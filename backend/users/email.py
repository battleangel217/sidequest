# users/email.py
import threading
from djoser.email import ActivationEmail, PasswordResetEmail

class CustomActivationEmail(ActivationEmail):
    def send(self, to, *args, **kwargs):
        thread = threading.Thread(
            target=super().send, args=(to,), kwargs={'fail_silently': True}
        )
        thread.daemon = True
        thread.start()

class CustomPasswordResetEmail(PasswordResetEmail):
    def send(self, to, *args, **kwargs):
        thread = threading.Thread(
            target=super().send, args=(to,), kwargs={'fail_silently': True}
        )
        thread.daemon = True
        thread.start()