import { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";

const getAnimalSchema = (t) => Yup.object({
  name: Yup.string().required(t("name") + " " + t("requiredField")),
  species: Yup.string().required(t("species") + " " + t("requiredField")),
  zone: Yup.string().required(t("zone") + " " + t("requiredField")),
  status: Yup.string().required(t("status") + " " + t("requiredField")),
  description: Yup.string().required(t("description") + " " + t("requiredField")),
  imageUrls: Yup.array().of(
    Yup.string().test(
      "is-url-or-path",
      t("invalidImageUrl"),
      (value) => {
        if (!value) return true;
        return value.startsWith("http://") || 
               value.startsWith("https://") || 
               value.startsWith("/uploads/") ||
               value.startsWith("/");
      }
    )
  ).nullable()
});

const getEventSchema = (t) => Yup.object({
  title: Yup.string().required(t("title") + " " + t("requiredField")),
  description: Yup.string().required(t("description") + " " + t("requiredField")),
  startTime: Yup.string().required(t("startTimeRequired")),
  endTime: Yup.string().required(t("endTimeRequired")),
  capacity: Yup.number().min(1, t("capacityMin")).required(t("capacityRequired")),
  type: Yup.string().nullable(),
  meta: Yup.string().nullable()
});

const getNewsSchema = (t) => Yup.object({
  title: Yup.string().required(t("title") + " " + t("requiredField")),
  content: Yup.string().required(t("content") + " " + t("requiredField"))
});

export const AdminDashboard = () => {
  const { t } = useTranslation();
  const [animals, setAnimals] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [messages, setMessages] = useState({ animal: "", event: "", news: "" });
  const [editing, setEditing] = useState({ type: null, id: null, data: null });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    api.get("/animals").then(({ data }) => setAnimals(data.content || []));
    api.get("/events").then(({ data }) => setEvents(Array.isArray(data) ? data : []));
    api.get("/news").then(({ data }) => setNews(Array.isArray(data) ? data : []));
  };

  const showMessage = (type, message, isError = false) => {
    setMessages((prev) => ({ ...prev, [type]: message }));
    setTimeout(() => {
      setMessages((prev) => ({ ...prev, [type]: "" }));
    }, 5000);
  };

  const uploadImage = async (file, push) => {
    try {
      // Проверяем тип файла
      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите изображение");
        return;
      }
      
      // Проверяем размер файла (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Размер файла не должен превышать 5MB");
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      
      // НЕ устанавливаем Content-Type вручную - браузер сделает это сам с boundary
      const { data } = await api.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      if (data && data.url) {
        // Убеждаемся, что URL начинается с /uploads/
        let url = data.url.startsWith("/") ? data.url : "/" + data.url;
        // Если URL не начинается с /uploads/, добавляем префикс
        if (!url.startsWith("/uploads/")) {
          url = "/uploads/" + url.replace(/^\/+/, "");
        }
        console.log("Uploaded image URL:", url);
        console.log("Adding URL to form array");
        push(url);
        console.log("URL added successfully to form");
      } else {
        throw new Error("Неверный ответ от сервера: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      console.error("Error response:", error.response);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Ошибка при загрузке изображения";
      alert("Ошибка при загрузке изображения: " + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (type, item) => {
    if (type === "event" && item.startTime) {
      // Преобразуем OffsetDateTime в datetime-local формат
      const startDate = new Date(item.startTime);
      const endDate = new Date(item.endTime);
      const formatForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
      setEditing({
        type,
        id: item.id,
        data: {
          ...item,
          startTime: formatForInput(startDate),
          endTime: formatForInput(endDate)
        }
      });
    } else if (type === "animal") {
      // Обрабатываем imageUrls - могут быть массивом или строкой JSON
      let imageUrls = [];
      if (item.imageUrls) {
        if (Array.isArray(item.imageUrls)) {
          imageUrls = item.imageUrls;
        } else {
          try {
            imageUrls = JSON.parse(item.imageUrls);
          } catch {
            imageUrls = [];
          }
        }
      }
      setEditing({
        type,
        id: item.id,
        data: { ...item, imageUrls }
      });
    } else {
      setEditing({
        type,
        id: item.id,
        data: { ...item }
      });
    }
  };

  const handleDelete = async (type, id) => {
    const typeName = type === "animal" ? t("confirmDeleteAnimal") : type === "event" ? t("confirmDeleteEvent") : t("confirmDeleteNews");
    if (!confirm(`${t("confirmDelete")} ${typeName}${t("confirmDeleteQuestion")}`)) {
      return;
    }
    try {
      await api.delete(`/${type === "animal" ? "animals" : type === "event" ? "events" : "news"}/${id}`);
      loadData();
      const deletedMsg = type === "animal" ? t("animalDeleted") : type === "event" ? t("eventDeleted") : t("newsDeleted");
      showMessage(type, deletedMsg);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      showMessage(type, `Ошибка при удалении: ${error.response?.data?.message || error.message}`, true);
    }
  };

  const handleUpdate = async (type, id, values) => {
    try {
      let payload = { ...values };
      if (type === "event") {
        const formatDateTime = (dtLocal) => {
          if (!dtLocal) return null;
          return new Date(dtLocal).toISOString();
        };
        payload = {
          ...values,
          startTime: formatDateTime(values.startTime),
          endTime: formatDateTime(values.endTime)
        };
      }
      await api.put(`/${type === "animal" ? "animals" : type === "event" ? "events" : "news"}/${id}`, payload);
      loadData();
      setEditing({ type: null, id: null, data: null });
      const updatedMsg = type === "animal" ? t("animalUpdated") : type === "event" ? t("eventUpdated") : t("newsUpdated");
      showMessage(type, updatedMsg);
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      showMessage(type, `Ошибка при обновлении: ${error.response?.data?.message || error.message}`, true);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <span>⚙️</span>
          <span className="gradient-text">{t("adminPanel")}</span>
        </h1>
        <p className="text-slate-600">{t("adminSubtitle")}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>{editing.type === "animal" ? "✏️" : "🦁"}</span>
            <span className="gradient-text">{editing.type === "animal" ? t("editAnimal") : t("newAnimal")}</span>
          </h2>
          <Formik
            validationSchema={getAnimalSchema(t)}
            initialValues={editing.type === "animal" && editing.data ? editing.data : {
              name: "",
              species: "",
              zone: "",
              status: "active",
              description: "",
              imageUrls: []
            }}
            enableReinitialize
            onSubmit={async (values, helpers) => {
              console.log("=== ONSUBMIT CALLED ===");
              console.log("Raw values:", values);
              try {
                // Убеждаемся, что imageUrls всегда массив (не null)
                const payload = {
                  ...values,
                  imageUrls: values.imageUrls || []
                };
                
                console.log("Submitting animal payload:", JSON.stringify(payload, null, 2));
                
                if (editing.type === "animal" && editing.id) {
                  await handleUpdate("animal", editing.id, payload);
                } else {
                  const { data } = await api.post("/animals", payload);
                  console.log("Animal created:", data);
                  setAnimals((prev) => [data, ...prev]);
                  showMessage("animal", t("animalAdded"));
                }
                helpers.resetForm();
                setEditing({ type: null, id: null, data: null });
                loadData();
              } catch (error) {
                console.error("Error creating/updating animal:", error);
                console.error("Error response:", error.response);
                let errorMessage = error.response?.data?.message || 
                                  error.response?.data?.error || 
                                  error.message || 
                                  "Ошибка при сохранении животного";
                
                // Если есть ошибки валидации, добавляем их к сообщению
                if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                  const validationErrors = error.response.data.errors
                    .map(err => `${err.field}: ${err.message}`)
                    .join(", ");
                  errorMessage += " (" + validationErrors + ")";
                }
                
                console.error("Full error:", error);
                showMessage("animal", errorMessage, true);
              }
            }}
          >
            {({ values, isSubmitting, errors, touched, handleSubmit }) => {
              return (
              <Form 
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("=== FORM SUBMIT ===");
                  console.log("Form values:", values);
                  console.log("Form errors:", errors);
                  console.log("Form touched:", touched);
                  handleSubmit(e);
                }}
              >
                {["name", "species", "zone"].map((field) => (
                  <Field
                    key={field}
                    name={field}
                    placeholder={t(field)}
                    className="input-field"
                  />
                ))}
                <Field as="select" name="status" className="input-field">
                  <option value="active">✅ {t("active")}</option>
                  <option value="rest">😴 {t("onRest")}</option>
                </Field>
                <Field
                  as="textarea"
                  name="description"
                  placeholder={t("description")}
                  className="input-field h-24 resize-none"
                />
                <FieldArray
                  name="imageUrls"
                  render={({ remove, push }) => (
                    <div className="space-y-2">
                      <label className="text-sm text-slate-600">{t("images")}</label>
                      {values.imageUrls.map((url, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Field
                            name={`imageUrls.${idx}`}
                            className="input-field flex-1"
                          />
                          <button type="button" onClick={() => remove(idx)} className="text-red-500">
                            ×
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-sm text-brand"
                          onClick={() => push("")}
                        >
                          {t("addUrl")}
                        </button>
                        <label className={`text-sm text-brand cursor-pointer ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                          {uploading ? t("uploading") : t("uploadFile")}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            disabled={uploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) uploadImage(file, push);
                              // Сбрасываем значение, чтобы можно было загрузить тот же файл снова
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                />
                {messages.animal && (
                  <p className={`text-sm ${messages.animal.includes("Ошибка") ? "text-red-600" : "text-green-600"}`}>
                    {messages.animal}
                  </p>
                )}
                {editing.type === "animal" && editing.id && (
                  <button
                    type="button"
                    onClick={() => setEditing({ type: null, id: null, data: null })}
                    className="w-full bg-slate-300 hover:bg-slate-400 text-white font-semibold rounded-lg py-2.5 mb-2 transition-all duration-200"
                  >
                    {t("cancel")}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full"
                >
                  {editing.type === "animal" && editing.id ? t("update") : t("save")}
                </button>
              </Form>
            )}}
          </Formik>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>{editing.type === "event" ? "✏️" : "📅"}</span>
            <span className="gradient-text">{editing.type === "event" ? t("editEvent") : t("newEvent")}</span>
          </h2>
          <Formik
            validationSchema={getEventSchema(t)}
            initialValues={editing.type === "event" && editing.data ? editing.data : {
              title: "",
              description: "",
              startTime: "",
              endTime: "",
              capacity: 10,
              type: "",
              meta: ""
            }}
            enableReinitialize
            onSubmit={async (values, helpers) => {
              try {
                if (editing.type === "event" && editing.id) {
                  await handleUpdate("event", editing.id, values);
                } else {
                  const formatDateTime = (dtLocal) => {
                    if (!dtLocal) return null;
                    return new Date(dtLocal).toISOString();
                  };
                  const payload = {
                    ...values,
                    startTime: formatDateTime(values.startTime),
                    endTime: formatDateTime(values.endTime)
                  };
                  const { data } = await api.post("/api/events", payload);
                  setEvents((prev) => [data, ...prev]);
                  showMessage("event", t("eventAdded"));
                }
                helpers.resetForm();
                setEditing({ type: null, id: null, data: null });
                loadData();
              } catch (error) {
                console.error("Error creating/updating event:", error);
                showMessage("event", error.response?.data?.message || "Ошибка при сохранении события", true);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-3">
                <Field name="title" placeholder={t("title")} className="input-field" />
                <Field as="textarea" name="description" placeholder={t("description")} className="input-field h-20 resize-none" />
                <Field name="type" placeholder={t("typePlaceholder")} className="input-field" />
                <Field name="meta" placeholder={t("metadata")} className="input-field" />
                <Field name="capacity" type="number" placeholder={t("capacity")} className="input-field" />
                <div>
                  <label className="text-sm text-slate-600 block mb-1">{t("startTime")}</label>
                  <Field name="startTime" type="datetime-local" className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 block mb-1">{t("endTime")}</label>
                  <Field name="endTime" type="datetime-local" className="input-field" />
                </div>
                {messages.event && (
                  <p className={`text-sm ${messages.event.includes("Ошибка") ? "text-red-600" : "text-green-600"}`}>
                    {messages.event}
                  </p>
                )}
                {editing.type === "event" && editing.id && (
                  <button
                    type="button"
                    onClick={() => setEditing({ type: null, id: null, data: null })}
                    className="w-full bg-slate-300 hover:bg-slate-400 text-white font-semibold rounded-lg py-2.5 mb-2 transition-all duration-200"
                  >
                    {t("cancel")}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900"
                >
                  {editing.type === "event" && editing.id ? t("update") : t("newEvent")}
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>{editing.type === "news" ? "✏️" : "📰"}</span>
            <span className="gradient-text">{editing.type === "news" ? t("editNews") : t("newsItem")}</span>
          </h2>
          <Formik
            validationSchema={getNewsSchema(t)}
            initialValues={editing.type === "news" && editing.data ? editing.data : { title: "", content: "" }}
            enableReinitialize
            onSubmit={async (values, helpers) => {
              try {
                if (editing.type === "news" && editing.id) {
                  await handleUpdate("news", editing.id, values);
                } else {
                  const { data } = await api.post("/api/news", values);
                  setNews((prev) => [data, ...prev]);
                  showMessage("news", t("newsPublished"));
                }
                helpers.resetForm();
                setEditing({ type: null, id: null, data: null });
                loadData();
              } catch (error) {
                console.error("Error creating/updating news:", error);
                showMessage("news", error.response?.data?.message || "Ошибка при сохранении новости", true);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-3">
                <Field name="title" placeholder={t("title")} className="input-field" />
                <Field as="textarea" name="content" placeholder={t("content")} className="input-field h-32 resize-none" />
                {messages.news && (
                  <p className={`text-sm ${messages.news.includes("Ошибка") ? "text-red-600" : "text-green-600"}`}>
                    {messages.news}
                  </p>
                )}
                {editing.type === "news" && editing.id && (
                  <button
                    type="button"
                    onClick={() => setEditing({ type: null, id: null, data: null })}
                    className="w-full bg-slate-300 hover:bg-slate-400 text-white font-semibold rounded-lg py-2.5 mb-2 transition-all duration-200"
                  >
                    {t("cancel")}
                  </button>
                )}
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                  {editing.type === "news" && editing.id ? t("update") : t("publish")}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🦁</span>
            <span className="gradient-text">{t("currentAnimals")}</span>
          </h3>
          <ul className="space-y-3">
            {animals.map((animal) => (
              <li key={animal.id} className="card p-4 flex items-center justify-between hover:shadow-lg transition-all duration-200">
                <div className="flex-1">
                  <span className="font-bold text-slate-800">{animal.name}</span>
                  <span className="text-sm text-slate-500 ml-2">🌍 {animal.zone}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit("animal", animal)}
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    title={t("edit")}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete("animal", animal.id)}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-lg rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    title={t("delete")}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📅</span>
            <span className="gradient-text">{t("currentEvents")}</span>
          </h3>
          <ul className="space-y-3">
            {events.map((event) => (
              <li key={event.id} className="card p-4 flex items-center justify-between hover:shadow-lg transition-all duration-200">
                <div className="flex-1">
                  <span className="font-bold text-slate-800">{event.title}</span>
                  <span className="text-sm text-slate-500 ml-2">👥 {event.capacity} мест</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit("event", event)}
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    title={t("edit")}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete("event", event.id)}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-lg rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    title={t("delete")}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📰</span>
            <span className="gradient-text">{t("currentNews")}</span>
          </h3>
          <ul className="space-y-3">
            {news.map((item) => (
              <li key={item.id} className="card p-4 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-bold text-slate-800 flex-1">{item.title}</p>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => handleEdit("news", item)}
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete("news", item.id)}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">{item.content}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};


