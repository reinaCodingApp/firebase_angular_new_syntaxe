export class FirebaseErrors {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static Parse(errorCode: string): string {
      let message: string;
      switch (errorCode) {
        case 'auth/wrong-password':
          message = 'Mot de passe incorrect';
          break;
        case 'auth/network-request-failed':
          message = 'Veuillez vérifier votre connexion réseau';
          break;
        case 'auth/too-many-requests':
          message =
            'Trop de connexion en peu de temps';
          break;
        case 'auth/user-disabled':
          message =
            'Votre compte a été désactivé ou supprimé, prière de contacter votre administrateur';
          break;
        case 'auth/requires-recent-login':
          message = 'Veuillez indiquer un mot de passe plus récent';
          break;
        case 'auth/email-already-exists':
          message = 'Cette adresse mail existe déjà';
          break;
        case 'auth/user-not-found':
          message =
            'L\'adresse ne correspond à aucun compte existant';
          break;
        case 'auth/phone-number-already-exists':
          message = 'Ce numéro de téléphone existe déjà';
          break;
        case 'auth/invalid-phone-number':
          message = 'Numéro de téléphone non valide';
          break;
        case 'auth/invalid-email':
          message = 'Adresse mail non valide';
          break;
        case 'auth/cannot-delete-own-user-account':
          message = 'Vous ne pouvez pas supprimer votre propre compte utilisateur';
          break;
          case 'auth/weak-password':
            message = 'Le mot de passe doit comporter au moins 6 caractères';
            break;
            default:
              message = 'Une erreur inconnue s\'est produite, veuillez réessayer (Code erreur : '
              +errorCode+')';
              break;
      }
      return message;
    }
  }
