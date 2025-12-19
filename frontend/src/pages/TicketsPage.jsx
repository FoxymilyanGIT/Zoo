import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const schema = Yup.object({
  quantity: Yup.number().min(1).max(5).required(),
  eventId: Yup.number().nullable()
});

export const TicketsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  
  const getTicketWord = (n) => {
    if (i18n.language === "ru") {
      if (n === 1) return t("ticket");
      if (n < 5) return t("tickets2");
      return t("tickets5");
    }
    return n === 1 ? t("ticket") : t("tickets5");
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    api.get("/api/tickets").then(({ data }) => setTickets(data));
    api.get("/api/events").then(({ data }) => setEvents(data));
  }, [user, navigate]);

  return (
    <section className="max-w-5xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-2 animate-fade-in">
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>🎫</span>
          <span className="gradient-text">{t("buyTicket")}</span>
        </h2>
        <Formik
          initialValues={{ quantity: 1, eventId: "" }}
          validationSchema={schema}
          onSubmit={async (values, helpers) => {
            const payload = {
              quantity: Number(values.quantity),
              eventId: values.eventId ? Number(values.eventId) : undefined
            };
            const { data } = await api.post("/api/tickets", payload);
            setTickets((prev) => [...data, ...prev]);
            helpers.resetForm();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-2 block">{t("ticketQuantity")}</span>
                <Field as="select" name="quantity" className="input-field">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} {getTicketWord(n)}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="quantity" component="p" className="text-sm text-red-600 mt-1" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-2 block">{t("linkToEvent")}</span>
                <Field as="select" name="eventId" className="input-field">
                  <option value="">{t("withoutEvent")}</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </Field>
              </label>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? t("processing") : `💳 ${t("payEmulation")}`}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>📋</span>
          <span className="gradient-text">{t("myTickets")}</span>
        </h2>
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-slate-500">{t("noTickets")}</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="card p-5 bg-gradient-to-br from-brand-50 to-emerald-50 border-2 border-brand-200 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase text-slate-500 font-semibold">{t("ticketCode")}</span>
                  <span className="text-xs px-2 py-1 bg-brand-600 text-white rounded-full font-bold">
                    {ticket.paid ? `✅ ${t("paid")}` : `⏳ ${t("pending")}`}
                  </span>
                </div>
                <p className="font-bold text-xl text-brand-700 mb-2 font-mono">{ticket.code}</p>
                <p className="text-sm text-slate-600">
                  {ticket.eventId ? (
                    <span>🎪 {t("eventLabel")} #{ticket.eventId}</span>
                  ) : (
                    <span>🎫 {t("regularTicketLabel")}</span>
                  )}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};



