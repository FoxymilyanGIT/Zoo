import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const schema = (t) => Yup.object({
  email: Yup.string().email(t("invalidEmail")).required(t("requiredField")),
  password: Yup.string().min(6, t("minPassword")).required(t("requiredField"))
});

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  return (
    <section className="max-w-md mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">{t("joinUs")}</h1>
        <p className="text-slate-600">{t("registerSubtitle")}</p>
      </div>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={schema(t)}
        onSubmit={async (values, helpers) => {
          try {
            const { data } = await api.post("/auth/register", values);
            login(data.token);
            navigate("/");
          } catch {
            helpers.setStatus(t("registrationFailed"));
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="card p-8 space-y-5 shadow-xl">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 mb-2 block">📧 {t("email")}</span>
              <Field name="email" type="email" className="input-field" placeholder={t("placeholderEmail")} />
              <ErrorMessage name="email" component="p" className="text-sm text-red-600 mt-1" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 mb-2 block">🔒 {t("password")}</span>
              <Field name="password" type="password" className="input-field" placeholder={t("placeholderPasswordMin")} />
              <ErrorMessage name="password" component="p" className="text-sm text-red-600 mt-1" />
            </label>
            {status && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">{status}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t("registering") : t("createAccount")}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
};



