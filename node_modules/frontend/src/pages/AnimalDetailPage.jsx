import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";

// Парсинг imageUrls из строки (JSON) в массив
const parseImageUrls = (imageUrls) => {
  if (!imageUrls) return [];
  try {
    return JSON.parse(imageUrls);
  } catch {
    return Array.isArray(imageUrls) ? imageUrls : [];
  }
};

// Преобразование относительного URL в абсолютный для загруженных изображений
const getImageUrl = (url) => {
  if (!url) return "https://placehold.co/400x250";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/uploads/")) {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    return baseURL + url;
  }
  return url;
};

export const AnimalDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [animal, setAnimal] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/api/animals/${id}`)
      .then(({ data }) => setAnimal(data))
      .catch(() => setError(t("animalNotFound")));
  }, [id, t]);

  if (error) return <div className="max-w-4xl mx-auto p-6">{error}</div>;
  if (!animal) return <div className="max-w-4xl mx-auto p-6">{t("loadingAnimal")}</div>;

  const images = parseImageUrls(animal.imageUrls);

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {images.length > 0 ? (
            images.map((url, index) => (
              <div key={url} className="card p-0 overflow-hidden group">
                <img 
                  src={getImageUrl(url)} 
                  alt={`${animal.name} - фото ${index + 1}`} 
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x250";
                  }}
                />
              </div>
            ))
          ) : (
            <div className="card p-0 overflow-hidden">
              <img src="https://placehold.co/400x250" alt={animal.name} className="w-full h-auto object-cover" />
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase text-slate-500 font-semibold tracking-wider mb-2">{animal.species}</p>
            <h1 className="text-4xl font-bold gradient-text mb-4">{animal.name}</h1>
            <p className="text-slate-700 text-lg leading-relaxed">{animal.description}</p>
          </div>
          <div className="card p-6 space-y-4 bg-gradient-to-br from-brand-50 to-emerald-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌍</span>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">{t("habitatZone")}</p>
                <p className="text-lg font-bold text-slate-800">{animal.zone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{animal.status === "active" ? "✅" : "😴"}</span>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">{t("statusLabel")}</p>
                <p className="text-lg font-bold text-slate-800">
                  {animal.status === "active" ? t("availableForVisit") : t("onRestStatus")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



