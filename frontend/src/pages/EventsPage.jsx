import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EventCard } from "../components/EventCard";
import { api } from "../services/api";

export const EventsPage = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ type: "", q: "" });
  const [loading, setLoading] = useState(true);

  const { type, q } = filters;

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (type) params.type = type;
    if (q) params.q = q;
    api
      .get("/events", { params })
      .then(({ data }) => {
        console.log("Events data:", data); // Debug
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        console.error("Error details:", error.response?.data);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, [type, q]);

  return (
    <section className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <header className="space-y-2 mb-8">
        <p className="text-sm uppercase text-slate-500 font-semibold tracking-wider">ZooPark</p>
        <h1 className="text-4xl font-bold gradient-text">{t("eventsCalendar")}</h1>
        <p className="text-slate-600 text-lg">{t("eventsSubtitle")}</p>
      </header>
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder={`🔍 ${t("searchEvents")}`}
          className="input-field flex-1 min-w-[200px]"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="input-field"
        >
          <option value="">📅 {t("allTypes")}</option>
          <option value="feeding">{t("eventTypeFeeding")}</option>
          <option value="tour">{t("eventTypeTour")}</option>
          <option value="special">{t("eventTypeSpecial")}</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-bounce-slow text-4xl">🦁</div>
          <p className="text-slate-500 mt-4">{t("loadingEvents")}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-slate-500 text-lg">{t("eventsNotFound")}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event, index) => (
            <div key={event.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};


