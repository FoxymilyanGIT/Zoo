import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimalCard } from "../components/AnimalCard";
import { api } from "../services/api";

export const AnimalsPage = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ q: "", species: "", zone: "", status: "" });
  const [page, setPage] = useState(0);
  const [animals, setAnimals] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 0 });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const { q, species, zone, status } = filters;

  useEffect(() => {
    const fetchAnimals = async () => {
      setLoading(true);
      try {
        const params = { page };
        if (q) params.q = q;
        if (species) params.species = species;
        if (zone) params.zone = zone;
        if (status) params.status = status;
        const { data } = await api.get("/animals", { params });
        console.log("Animals data:", data); // Debug
        setAnimals(data.content || []);
        setPagination(data);
      } catch (error) {
        console.error("Error fetching animals:", error);
        console.error("Error details:", error.response?.data);
        setAnimals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimals();
  }, [q, species, zone, status, page]);

  useEffect(() => {
    api.get("/news").then(({ data }) => setNews(data));
  }, []);

  const uniqueZones = useMemo(() => [...new Set(animals.map((a) => a.zone))], [animals]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
        <div className="space-y-2">
          <p className="text-sm uppercase text-slate-500 font-semibold tracking-wider">ZooPark</p>
          <h1 className="text-4xl font-bold gradient-text">{t("animals")}</h1>
          <p className="text-slate-600 text-lg">{t("catalogSubtitle")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
          <input
            type="search"
            placeholder={`🔍 ${t("search")}...`}
            value={filters.q}
            onChange={(e) => {
              setFilters({ ...filters, q: e.target.value });
              setPage(0);
            }}
            className="input-field col-span-2"
          />
          <select
            value={filters.zone}
            onChange={(e) => {
              setFilters({ ...filters, zone: e.target.value });
              setPage(0);
            }}
            className="input-field"
          >
            <option value="">🌍 {t("allZones")}</option>
            {uniqueZones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              setPage(0);
            }}
            className="input-field"
          >
            <option value="">📊 {t("status")}</option>
            <option value="active">✅ {t("available")}</option>
            <option value="rest">😴 {t("onRest")}</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 mt-8 md:grid-cols-[2fr_1fr]">
        <div>
          {loading ? (
            <p>{t("loading")}</p>
          ) : animals.length === 0 ? (
            <p className="text-slate-500">{t("animalsNotFound")}</p>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                {animals.map((animal) => (
                  <AnimalCard key={animal.id} animal={animal} />
                ))}
              </div>
              <div className="flex justify-center items-center gap-3 mt-8">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="px-4 py-2 bg-white border-2 border-slate-300 rounded-lg font-medium hover:border-brand-500 hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ← {t("back")}
                </button>
                <span className="px-4 py-2 bg-gradient-to-r from-brand-100 to-emerald-100 text-brand-700 font-semibold rounded-lg">
                  {t("page")} {page + 1} / {pagination.totalPages || 1}
                </span>
                <button
                  disabled={page + 1 >= (pagination.totalPages || 1)}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 bg-white border-2 border-slate-300 rounded-lg font-medium hover:border-brand-500 hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {t("next")} →
                </button>
              </div>
            </>
          )}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>📍</span>
              <span className="gradient-text">{t("mapTitle")}</span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="card p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span>🦁</span> ZooPark
                  </h3>
                  <div className="space-y-3 text-slate-700">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">📍</span>
                      <div>
                        <p className="font-semibold">{t("address")}:</p>
                        <p>{t("cityAddress")}</p>
                        <p className="text-sm text-slate-500">{t("metro")}: {t("metroStation")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-xl">📞</span>
                      <div>
                        <p className="font-semibold">{t("phone")}:</p>
                        <p>{t("phoneNumber")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-xl">🕐</span>
                      <div>
                        <p className="font-semibold">{t("hours")}:</p>
                        <p>{t("daily")}: {t("workHours")}</p>
                        <p className="text-sm text-slate-500">{t("cashierCloses")} 19:00</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-xl">✉️</span>
                      <div>
                        <p className="font-semibold">{t("emailLabel")}:</p>
                        <p>{t("emailContact")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card p-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop" 
                  alt={t("zooMap")} 
                  className="w-full h-full object-cover min-h-[400px]"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/800x400/0B7C6F/FFFFFF?text=${encodeURIComponent(t("zooMap"))}`;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <aside className="card p-6 h-fit bg-gradient-to-br from-brand-50 to-emerald-50 border-2 border-brand-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📰</span>
            <span className="gradient-text">{t("news")}</span>
          </h3>
          <ul className="space-y-4">
            {news.map((item) => (
              <li key={item.id} className="pb-4 border-b border-brand-200 last:border-0 last:pb-0">
                <p className="font-bold text-slate-800 mb-2 hover:text-brand-700 transition-colors duration-200">{item.title}</p>
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{item.content}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
};


