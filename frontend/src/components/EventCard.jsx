import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Форматирование даты без date-fns
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month} ${hours}:${minutes}`;
  } catch {
    return "";
  }
};

export const EventCard = ({ event }) => {
  const { t } = useTranslation();
  if (!event) return null;
  const available = event.capacity - event.bookedCount;
  const typeLabels = {
    feeding: t("eventTypeFeeding"),
    tour: t("eventTypeTour"),
    special: t("eventTypeSpecial")
  };
  
  return (
    <div className="card p-5 flex flex-col gap-3 group animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-gradient-to-r from-brand-100 to-emerald-100 text-brand-700 text-xs font-semibold rounded-full">
          {typeLabels[event.type] || t("eventTypeDefault")}
        </span>
        <span className="text-xs text-slate-500 font-medium">
          {formatDate(event.startTime)} — {formatDate(event.endTime)}
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-800 group-hover:text-brand-700 transition-colors duration-200">
        {event.title}
      </h3>
      <p className="text-sm text-slate-600 flex-1 line-clamp-3">{event.description}</p>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${available > 5 ? "text-emerald-600" : available > 0 ? "text-amber-600" : "text-red-600"}`}>
            {available > 0 ? `✅ ${available} ${t("placesAvailable")}` : `❌ ${t("noPlacesAvailable")}`}
          </span>
        </div>
        <Link 
          to={`/events/${event.id}`} 
          className="inline-flex items-center gap-1 text-brand-700 font-semibold hover:text-brand-800 group/link transition-all duration-200"
        >
          {t("moreDetails")}
          <span className="transform group-hover/link:translate-x-1 transition-transform duration-200">→</span>
        </Link>
      </div>
    </div>
  );
};



