import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Форматирование даты без date-fns
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const months = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  const month = months[date.getMonth()];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${hours}:${minutes}`;
};

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/events/${id}`).then(({ data }) => setEvent(data));
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const { data } = await api.post(`/events/${id}/register`);
    setMessage(`${t("ticketSuccess")} ${data.code}`);
  };

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <div className="inline-block animate-bounce-slow text-4xl mb-4">🦁</div>
        <p className="text-slate-500 text-lg">{t("loadingEvent")}</p>
      </div>
    );
  }

  const available = Math.max(0, event.capacity - event.bookedCount);
  const typeLabels = {
    feeding: t("eventTypeFeeding"),
    tour: t("eventTypeTour"),
    special: t("eventTypeSpecial")
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="card p-6 bg-gradient-to-r from-brand-50 to-emerald-50 border-2 border-brand-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{typeLabels[event.type] || "📅"}</span>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">{t("dateTime")}</p>
            <p className="text-lg font-bold text-slate-800">
              {formatDate(event.startTime)} — {formatDate(event.endTime)}
            </p>
          </div>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-4">{event.title}</h1>
        <p className="text-slate-700 text-lg leading-relaxed mb-6">{event.description}</p>
        
        <div className="flex items-center justify-between pt-4 border-t-2 border-brand-200">
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${available > 5 ? "text-emerald-600" : available > 0 ? "text-amber-600" : "text-red-600"}`}>
              {available > 0 ? `✅ ${available}` : "❌ 0"}
            </span>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">{t("freePlaces")}</p>
              <p className="text-sm text-slate-600">{t("outOf")} {event.capacity}</p>
            </div>
          </div>
          <button
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleRegister}
            disabled={available === 0}
          >
            {available > 0 ? t("registerButton") : t("noPlacesButton")}
          </button>
        </div>
      </div>
      
      {message && (
        <div className="card p-4 bg-green-50 border-2 border-green-200 animate-slide-up">
          <p className="text-green-700 font-semibold">{message}</p>
        </div>
      )}
    </section>
  );
};



