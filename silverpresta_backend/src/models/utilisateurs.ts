import { Schema, model } from 'mongoose';

// Interface TypeScript pour un utilisateur
export interface IUtilisateur {
  id: string;
  nom: string;
  prenom: string;
  courriel: string;
  mot_de_passe: string;
  role: 'admin' | 'employe' | 'gestionnaire';
  actif: boolean;
  date_creation?: Date;
}

// Schéma Mongoose
const UtilisateurSchema = new Schema<IUtilisateur>(
  {
    id: { 
      type: String, 
      required: false, 
      maxlength: [100, 'L\'identifiant ne peut pas dépasser 100 caractères.'], 
    },

    nom: { 
      type: String, 
      required: [true, 'Le nom est obligatoire.'], 
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères.'], 
    },

    prenom: { 
      type: String, 
      required: [true, 'Le prénom est obligatoire.'], 
      maxlength: [100, 'Le prénom ne peut pas dépasser 100 caractères.'], 
    },
    // Validation du courriel
    // source: https://mongoosejs.com/docs/schematypes.html#string-validators
    courriel: {
      type: String,
      required: [true, 'Le courriel est obligatoire.'],
      unique: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Le format du courriel est invalide.',
      ],
    },

    mot_de_passe: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire.'],
      minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères.'],
      // Validation personnalisée : mot de passe solide
      // source: https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
      validate: {
        validator: function (value: string) {
          // doit contenir au moins:
          // - 1 majuscule
          // - 1 minuscule
          // - 1 chiffre
          // - 1 caractère spécial
          const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.,;:+\-_=<>]).+$/;
          return regex.test(value);
        },
        message:
          'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.',
      },
    },

    role: {
      type: String,
      enum: {
        values: ['admin', 'employe', 'gestionnaire'],
        message: 'Le rôle doit être soit admin, employe ou gestionnaire.',
      },
      required: [true, 'Le rôle est obligatoire.'],
    },

    actif: { 
      type: Boolean, 
      default: true, 
    },

    date_creation: { 
      type: Date, 
      default: Date.now, 
    },
  },

  {
    timestamps: { createdAt: 'date_creation', updatedAt: false },
  },
);

// Modèle Mongoose
export const Utilisateur = model<IUtilisateur>('Utilisateur', UtilisateurSchema);
