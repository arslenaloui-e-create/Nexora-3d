"use client";

import { useState } from "react";

type GuideStep = {
  title: string;
  description: string;
};

const steps: GuideStep[] = [
  {
    title: "Bienvenue sur NEXORA 3D",
    description:
      "Votre espace vous permet de gérer vos demandes de devis, suivre vos projets, consulter vos fichiers et échanger directement avec l’équipe NEXORA 3D.",
  },
  {
    title: "Votre profil",
    description:
      "Depuis votre profil, vous pouvez modifier vos informations personnelles et professionnelles utilisées pour vos échanges et vos devis.",
  },
  {
    title: "Créer une demande",
    description:
      "Décrivez votre besoin, précisez les dimensions, les contraintes, le matériau ou le procédé souhaité et ajoutez les informations utiles à votre projet.",
  },
  {
    title: "Ajouter vos fichiers",
    description:
      "Vous pouvez transmettre vos fichiers techniques, modèles CAO, STL, STEP, PDF, images ou archives directement depuis votre espace.",
  },
  {
    title: "Suivre vos projets",
    description:
      "Une fois votre devis accepté et votre projet créé, vous pourrez suivre son statut, son historique et les différentes étapes de réalisation.",
  },
  {
    title: "Vos devis",
    description:
      "Lorsqu’un devis est disponible, vous pouvez le consulter depuis votre espace puis l’accepter ou le refuser.",
  },
  {
    title: "Messagerie",
    description:
      "Utilisez la messagerie pour communiquer avec l’équipe NEXORA 3D et conserver vos échanges directement dans la plateforme.",
  },
  {
    title: "Notifications",
    description:
      "Les notifications vous informent lorsqu’une action importante est nécessaire : nouveau devis, évolution de projet, fichier ou message.",
  },
  {
    title: "Vous êtes prêt",
    description:
      "Votre espace NEXORA 3D est maintenant prêt. Vous pouvez commencer par créer votre première demande de devis.",
  },
];

export default function UserGuide({
  onClose,
  onboarding = false,
}: {
  onClose?: () => void;
  onboarding?: boolean;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const step = steps[currentStep];

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  async function finish() {
    if (saving) return;

    setSaving(true);

    if (onboarding) {
      try {
        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          setSaving(false);
          return;
        }
      } catch {
        setSaving(false);
        return;
      }
    }

    onClose?.();
  }

  function next() {
    if (isLast) {
      void finish();
      return;
    }

    setCurrentStep((value) => value + 1);
  }

  function previous() {
    if (!isFirst) {
      setCurrentStep((value) => value - 1);
    }
  }

  return (
    <div
      className="user-guide-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-guide-title"
    >
      <div className="user-guide">
        <button
          type="button"
          className="user-guide-close"
          onClick={onClose}
          aria-label="Fermer le guide"
        >
          ×
        </button>

        <div className="user-guide-progress">
          <span>
            Étape {currentStep + 1} / {steps.length}
          </span>

          <div className="user-guide-progress-bar">
            <div
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="user-guide-content">
          <div className="user-guide-icon" aria-hidden="true">
            {currentStep === 0 ? "✦" : "◆"}
          </div>

          <p className="user-guide-eyebrow">
            GUIDE NEXORA 3D
          </p>

          <h2 id="user-guide-title">
            {step.title}
          </h2>

          <p>{step.description}</p>
        </div>

        <div className="user-guide-steps">
          {steps.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={index === currentStep ? "active" : ""}
              onClick={() => setCurrentStep(index)}
              aria-label={`Aller à l’étape ${
                index + 1
              }: ${item.title}`}
            />
          ))}
        </div>

        <div className="user-guide-actions">
          <button
            type="button"
            className="btn btn-quiet"
            onClick={previous}
            disabled={isFirst || saving}
          >
            Retour
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={next}
            disabled={saving}
          >
            {saving
              ? "Enregistrement…"
              : isLast
                ? "Terminer le guide"
                : "Suivant"}
          </button>
        </div>
      </div>
    </div>
  );
}