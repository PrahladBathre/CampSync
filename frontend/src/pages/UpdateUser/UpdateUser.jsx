import { useContext, useEffect, useState } from "react";
import { Alert, Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { Save, UserRound } from "lucide-react";
import { UserContext } from "../UserContext/UserContext";
import { updateTeacherDetails } from "../../services/teacher";

const UpdateUser = ({ open = true, onClose = () => {} }) => {
  const { user, updateUser: setCurrentUser } = useContext(UserContext);
  const [form, setForm] = useState({ teacherFullName: "", teacherEmail: "", teacherUsername: "", teacherContactInfo: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => { setForm({ teacherFullName: user?.teacherFullName || "", teacherEmail: user?.teacherEmail || "", teacherUsername: user?.teacherUsername || "", teacherContactInfo: user?.teacherContactInfo || "" }); setError(""); setSuccess(""); }, [user, open]);
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError(""); setSuccess("");
    try {
      const response = await updateTeacherDetails(form);
      const updated = response?.data?.data || response?.data;
      if (!updated) throw new Error("The server did not return the updated profile.");
      setCurrentUser({ ...user, ...updated }); setSuccess("Profile updated successfully.");
    } catch (e) { setError(e?.response?.data?.message || e.message || "Could not update your profile."); }
    finally { setSaving(false); }
  };
  return <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}><DialogTitle sx={{ pb: 1 }}>Account settings<Typography color="text.secondary" variant="body2" sx={{ mt: .5 }}>Manage your profile information.</Typography></DialogTitle><form onSubmit={submit}><DialogContent><Stack spacing={2.25} sx={{ pt: 1 }}><Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 2, borderRadius: 3, bgcolor: "action.hover" }}><Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}><UserRound size={22}/></Avatar><Stack><Typography fontWeight={700}>{form.teacherFullName || "Your profile"}</Typography><Typography variant="body2" color="text.secondary">{form.teacherEmail}</Typography></Stack></Stack>
    {error && <Alert severity="error">{error}</Alert>}{success && <Alert severity="success">{success}</Alert>}
    <TextField label="Full name" required fullWidth value={form.teacherFullName} onChange={e=>setForm({...form,teacherFullName:e.target.value})}/>
    <TextField label="Email" type="email" required fullWidth value={form.teacherEmail} onChange={e=>setForm({...form,teacherEmail:e.target.value})}/>
    <TextField label="Username" required fullWidth value={form.teacherUsername} onChange={e=>setForm({...form,teacherUsername:e.target.value})}/>
    <TextField label="Contact number" fullWidth value={form.teacherContactInfo} onChange={e=>setForm({...form,teacherContactInfo:e.target.value})}/>
  </Stack></DialogContent><DialogActions sx={{ p: 2.5, pt: 0, display: "flex", flexWrap: "wrap", gap: 1.25, "& .MuiButton-root": { minHeight: 42, visibility: "visible", opacity: 1 } }}><Button className="profile-cancel-button" onClick={onClose} disabled={saving} variant="outlined" sx={{ color: "text.primary", borderColor: "divider", backgroundColor: "background.paper", "&:hover": { backgroundColor: "action.hover", borderColor: "text.secondary" } }}>Cancel</Button><Button type="submit" variant="contained" startIcon={<Save size={17}/>} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button></DialogActions></form></Dialog>;
};
export default UpdateUser;
