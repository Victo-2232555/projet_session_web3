
// src/models/produits.ts
import { Schema, model, Types } from 'mongoose';

// Interface du produit
export interface IProduit {
  id: string;
  nom: string;
  code: string;
  categorie: string;
  description: string;
  quantite: number;
  seuilReapprovisionnement: number;
  prixVente: number;
  prixAchat: number;
  fournisseur: string;
  // je rajoute string pour faciliter les tests avec mockify
  ajoutePar: Types.ObjectId | string;
  misAJourPar: Types.ObjectId | string; 
  urlImage: string;
  actif: boolean;
  tags?: string[];
  dateAjout?: Date;
  dateMiseAJour?: Date;
}
// Schéma Mongoose du produit
const ProduitSchema = new Schema<IProduit>(
  {
    id: {
      type: String, 
      required: false, 
      maxlength: [100, 'L\'identifiant ne peut pas dépasser 100 caractères.']},
    nom: {
      type: String,
      required: [true, 'Le nom du produit est requis.'],
      minlength: [3, 'Le nom du produit doit contenir au moins 3 caractères.'],
      maxlength: [250, 'Le nom du produit ne peut pas dépasser 250 caractères.'],
    },
    code: { 
      type: String, 
      required: [true, 'Le code du produit est requis'], 
      unique: true, 
      maxlength: [50, 'Le code du produit ne peut pas dépasser 50 caractères.'] },

    categorie: {
      type: String,
      required: [true, 'La catégorie est obligatoire.'],
      maxlength: [100, 'La catégorie ne peut pas dépasser 100 caractères.']},

    description: {
      type: String,
      required: [true, 'Chaque produit doit avoir une description.'],
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères.']},

    quantite: {
      type: Number,
      required: [true, 'La quantité est obligatoire.'],
      min: [0, 'La quantité ne peut pas être négative.']},

    seuilReapprovisionnement: {
      type: Number,
      required: [true, 'Le seuil de réapprovisionnement est obligatoire.'],
      min: [0, 'Le seuil de réapprovisionnement doit être positif.']},

    prixAchat: {
      type: Number,
      required: [true, 'Le prix d\'achat est requis.'],
      min: [0, 'Le prix d\'achat doit être positif.'],
    },

    prixVente: {
      type: Number,
      required: [true, 'Le prix de vente est requis.'],
      min: [0, 'Le prix de vente doit être positif.'],
      // Validation personnalisée : le prixVente doit être supérieur ou prixAchat
      validate: {
        validator: function (this: IProduit, value: number) {
          // si prixAchat n'est pas défini, on ne bloque pas
          if (this.prixAchat === undefined || this.prixAchat === null) {
            return true;
          }
          return value >= this.prixAchat;
        },
        message: 'Le prix de vente doit être supérieur ou égal au prix d\'achat.',
      },
    },

    fournisseur: {
      type: String,
      required: [true, 'Le fournisseur est obligatoire.'],
      maxlength: [150, 'Le nom du fournisseur ne peut pas dépasser 150 caractères.'],
    },

    ajoutePar: {
      type: Schema.Types.ObjectId,
      ref: 'Utilisateur',
      required: [true, 'L\'utilisateur ayant ajouté le produit est obligatoire.'],
    },

    misAJourPar: {
      type: Schema.Types.ObjectId,
      ref: 'Utilisateur',
      required: [true, 'L\'utilisateur ayant mis à jour le produit est obligatoire.'],
    },

    urlImage: {
      type: String,
      required: false,
      maxlength: [500, 'L\'URL de l\'image ne peut pas dépasser 500 caractères.'],
    },

    actif: {
      type: Boolean,
      default: true,
    },

    tags: {
      type: [String],
      required: false,
      // Validation personnalisée : un produit ne peut avoir plus de 5 tags
      validate: {
        validator: function (value: string[]) {
          if (!value) return true;
          return value.length <= 5;
        },
        message: 'Un produit ne peut pas avoir plus de 5 tags.',
      },
    },

    dateAjout: {
      type: Date,
      default: Date.now,
    },

    dateMiseAJour: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // timestamps mettra à jour dateAjout et dateMiseAJour automatiquement
    timestamps: { createdAt: 'dateAjout', updatedAt: 'dateMiseAJour' },
  
  },

);

// Modèle Mongoose
export const Produit = model<IProduit>('Produit', ProduitSchema);
