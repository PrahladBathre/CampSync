import { useContext, useEffect, useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { UserContext } from "../UserContext/UserContext";
import { updateTeacherDetails } from "../../services/teacher";

const UpdateUser = ({ open = true, onClose = () => {} }) => {
  const { user, updateUser: setCurrentUser } = useContext(UserContext);
  const [form, setForm] = useState({ teacherFullName: "", teacherEmail: "", teacherUsername: "", teacherContactInfo: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => { setForm({ teacherFullName: user?.teacherFullName || "", teacherEmail: user?.teacherEmail || "", teacherUsername: user?.teacherUsername || "", teacherContactInfo: user?.teacherContactInfo || "" }); }, [user, open]);
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError(""); setSuccess("");
    try {
      const response = await updateTeacherDetails({ ...user, ...form });
      const updated = response?.data?.data || response?.data || { ...user, ...form };
      setCurrentUser(updated); setSuccess("Profile updated successfully.");
    } catch (e) { setError(e?.response?.data?.message || e.message || "Could not update your profile."); }
    finally { setSaving(false); }
  };
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"><DialogTitle>Profile settings</DialogTitle><form onSubmit={submit}><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
    {error && <Alert severity="error">{error}</Alert>}{success && <Alert severity="success">{success}</Alert>}
    <TextField label="Full name" required fullWidth value={form.teacherFullName} onChange={e=>setForm({...form,teacherFullName:e.target.value})}/>
    <TextField label="Email" type="email" required fullWidth value={form.teacherEmail} onChange={e=>setForm({...form,teacherEmail:e.target.value})}/>
    <TextField label="Username" required fullWidth value={form.teacherUsername} onChange={e=>setForm({...form,teacherUsername:e.target.value})}/>
    <TextField label="Contact number" fullWidth value={form.teacherContactInfo} onChange={e=>setForm({...form,teacherContactInfo:e.target.value})}/>
  </Stack></DialogContent><DialogActions sx={{ p: 2 }}><Button onClick={onClose}>Close</Button><Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button></DialogActions></form></Dialog>;
};
export default UpdateUser;
