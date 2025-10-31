import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import { getMyProfile, updateProfile } from "@/services/userService";
import Layout from "@/layout/Layout";
import styles from "@/styles/Perfil.module.css";

export default function Perfil() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchProfile() {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMyProfile();
        if (!ignore) {
          setProfile(data);
          setFormData({
            nome: data.nome || "",
            email: data.email || "",
            telefone: data.telefone || "",
          });
        }
      } catch (err) {
        if (!ignore) {
          setError("Erro ao carregar perfil");
          console.error(err);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      ignore = true;
    };
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setError("");
      setSuccess("");

      // Validação básica
      if (!formData.nome.trim()) {
        setError("Nome é obrigatório");
        return;
      }

      if (!formData.telefone.trim()) {
        setError("Telefone é obrigatório");
        return;
      }

      setSaving(true);

      await updateProfile({
        nome: formData.nome.trim(),
        telefone: formData.telefone.trim(),
      });

      setSuccess("Perfil atualizado com sucesso!");
      setEditing(false);

      // Recarregar dados
      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      setError("Erro ao salvar perfil: " + err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: profile.nome || "",
      email: profile.email || "",
      telefone: profile.telefone || "",
    });
    setEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.loading}>Carregando perfil...</div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.error}>Perfil não encontrado</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Meu Perfil</h1>
          <p className={styles.subtitle}>Gerencie suas informações pessoais</p>
        </div>

        {error && <div className={styles.alertError}>{error}</div>}
        {success && <div className={styles.alertSuccess}>{success}</div>}

        <div className={styles.profileCard}>
          {/* Avatar */}
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {formData.nome
                ? formData.nome
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "?"}
            </div>
            <div className={styles.avatarInfo}>
              <h2 className={styles.userName}>{profile.nome}</h2>
              <p className={styles.userCargo}>
                {profile.cargo === "PROPRIETARIO"
                  ? "Proprietário"
                  : profile.cargo === "ADMIN"
                  ? "Administrador"
                  : profile.cargo}
              </p>
            </div>
          </div>

          {/* Informações */}
          <div className={styles.infoSection}>
            {editing ? (
              <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                {/* Nome */}
                <div className={styles.formGroup}>
                  <label htmlFor="nome" className={styles.label}>
                    Nome Completo <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="nome"
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Digite seu nome completo"
                    maxLength={100}
                    required
                  />
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    className={styles.input}
                    disabled
                  />
                  <small className={styles.hint}>
                    Email não pode ser alterado
                  </small>
                </div>

                {/* Telefone */}
                <div className={styles.formGroup}>
                  <label htmlFor="telefone" className={styles.label}>
                    Telefone <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="telefone"
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                {/* Botões */}
                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={styles.btnSave}
                    disabled={saving || !formData.nome.trim() || !formData.telefone.trim()}
                  >
                    {saving ? "Salvando..." : "Salvar Alterações"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={styles.btnCancel}
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className={styles.infoGrid}>
                  {/* Email */}
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>{profile.email}</span>
                  </div>

                  {/* Telefone */}
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Telefone</span>
                    <span className={styles.infoValue}>
                      {profile.telefone || "Não informado"}
                    </span>
                  </div>

                  {/* Cargo */}
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Cargo</span>
                    <span className={styles.infoValue}>
                      {profile.cargo === "PROPRIETARIO"
                        ? "Proprietário"
                        : profile.cargo === "ADMIN"
                        ? "Administrador"
                        : profile.cargo}
                    </span>
                  </div>
                </div>

                {/* Botão Editar */}
                <button
                  onClick={() => setEditing(true)}
                  className={styles.btnEdit}
                >
                  <svg
                    className={styles.icon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Editar Perfil
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
