import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CloseIcon from "@mui/icons-material/Close";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker"; // DesktopTimePicker 권장하지만 모바일 대응 위해 TimePicker 유지
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../hooks/api";
import { getCustomWeek } from "../utils/common";
import { getUserFromToken } from "../utils/jwt";
import { showAlert } from "../utils/swal";

dayjs.locale("ko");

type DaySchedule = {
  date: Dayjs;
  time: Dayjs | null;
};

interface GroupInfo {
  name: string;
  createdBy: string;
}

const COMMON_TIMES = ["18:00", "19:00", "20:00", "21:00"];

const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(getUserFromToken());
  
  // ---------- 일정 관리 상태 ----------
  const [anchorDate, setAnchorDate] = useState<Dayjs>(() => dayjs());
  const [week, setWeek] = useState<DaySchedule[]>([]);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [batchTime, setBatchTime] = useState<Dayjs | null>(dayjs().hour(18).minute(0)); // 일괄 적용용 시간

  // ---------- 그룹 관리 상태 ----------
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
  const [targetGroup, setTargetGroup] = useState<string>("");
  const [newGroupName, setNewGroupName] = useState("");
  const [inviteUsername, setInviteUsername] = useState("");

  // 1. 초기 데이터 로드 (일정)
  useEffect(() => {
    const { week, startDate, endDate } = getCustomWeek(anchorDate);
    setWeek(week);
    setStartDate(startDate);
    setEndDate(endDate);
  }, [anchorDate]);

  useEffect(() => {
    if (startDate && endDate && user) {
      fetchSchedule();
    }
  }, [startDate, endDate, user]);

  // 2. 초기 데이터 로드 (그룹)
  useEffect(() => {
    if (user) fetchGroups();
  }, [user]);

  const fetchSchedule = async () => {
    try {
      const res = await api.get(
        `/api/schedule?user=${user}&startDate=${startDate?.format("YYYY-MM-DD")}&endDate=${endDate?.format("YYYY-MM-DD")}&gubun=s`
      );
      const loadedWeek: DaySchedule[] = week.map((d) => {
        const found = res.data.find((item: any) => item.date === d.date.format("YYYY-MM-DD"));
        return {
          date: d.date,
          time: found ? dayjs(`${found.date}T${found.time}`) : null,
        };
      });
      setWeek(loadedWeek);
    } catch (err) {
      console.error("일정 로드 실패", err);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await api.get<GroupInfo[]>(`/api/groups?user=${user}`);
      setGroups(res.data);
    } catch (err) {
      console.error("그룹 로드 실패", err);
    }
  };

  // 일정 핸들러
  const handleTimeChange = (index: number, value: Dayjs | null) => {
    setWeek((prev) => prev.map((d, i) => (i === index ? { ...d, time: value } : d)));
  };

  const handleRemoveTime = (index: number) => {
    setWeek((prev) => prev.map((d, i) => (i === index ? { ...d, time: null } : d)));
  };

  const handleQuickTime = (index: number, timeString: string) => {
    const [h, m] = timeString.split(":").map(Number);
    const newTime = week[index].date.hour(h).minute(m);
    handleTimeChange(index, newTime);
  };

  const handleBatchApply = (onlyWeekdays: boolean) => {
    if (!batchTime) return;
    setWeek((prev) => 
      prev.map((d) => {
        // 주말(0:일, 6:토) 체크
        const day = d.date.day();
        if (onlyWeekdays && (day === 0 || day === 6)) return d; // 주말 건너뛰기
        
        // 시간 설정 (날짜는 유지, 시간만 변경)
        const newTime = d.date.hour(batchTime.hour()).minute(batchTime.minute());
        return { ...d, time: newTime };
      })
    );
  };

  const handleClearAll = () => {
    setWeek((prev) => prev.map((d) => ({ ...d, time: null })));
  };

  const handleSubmitSchedule = async () => {
    const payload = {
      user: user,
      schedule: week.map((d) => ({
        date: d.date.format("YYYY-MM-DD"),
        time: d.time ? d.time.format("HH:mm") : null,
      })),
    };
    try {
      await api.post("/api/schedule", payload);
      await showAlert("저장 완료", "일정이 저장되었습니다.", "success");
    } catch (err: any) {
      await showAlert("저장 실패", "저장에 실패했습니다: " + err.message, "error");
    }
  };

  // 그룹 핸들러
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      await api.post("/api/groups", { name: newGroupName, user: user });
      await showAlert("생성 완료", `'${newGroupName}' 그룹을 생성했습니다.`, "success");
      setNewGroupName("");
      setOpenCreate(false);
      fetchGroups();
    } catch (err) {
      await showAlert("오류", "그룹 생성에 실패했습니다.", "error");
    }
  };

  const handleInviteUser = async () => {
    if (!inviteUsername.trim()) return;
    try {
      await api.post("/api/groups/invite", { 
        requester: user,
        username: inviteUsername, 
        groupName: targetGroup 
      });
      await showAlert("초대 완료", `'${inviteUsername}'님을 초대했습니다.`, "success");
      setInviteUsername("");
      setOpenInvite(false);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.response?.data || "권한이 없거나 존재하지 않는 유저입니다.";
      await showAlert("초대 실패", typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg), "error");
    }
  };

  const openInviteDialog = (groupName: string) => {
    setTargetGroup(groupName);
    setOpenInvite(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <Box sx={{ py: 2 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          
          {/* 좌측: 그룹 관리 패널 */}
          <Box sx={{ width: { xs: "100%", md: "300px", lg: "350px" }, flexShrink: 0 }}>
            <Card elevation={3} sx={{ height: "100%" }}>
              <CardHeader
                title="내 그룹 목록"
                subheader="그룹 리더만 초대 가능합니다"
                action={
                  <IconButton onClick={() => setOpenCreate(true)} color="primary">
                    <AddIcon />
                  </IconButton>
                }
              />
              <Divider />
              {/* Group list rendering */}
              <List sx={{ maxHeight: 500, overflow: "auto" }}>
                {groups.length === 0 ? (
                  <Box p={3} textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      가입된 그룹이 없습니다.
                    </Typography>
                  </Box>
                ) : (
                  groups.map((group) => (
                    <ListItem
                      key={group.name}
                      secondaryAction={
                        group.createdBy === user && (
                          <IconButton edge="end" onClick={() => openInviteDialog(group.name)} title="팀원 초대">
                            <PersonAddIcon color="primary" />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: group.createdBy === user ? "primary.main" : "secondary.main" }}>
                          <GroupIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={group.name} 
                        secondary={group.createdBy === user ? "리더 (초대 가능)" : "멤버"}
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Card>
          </Box>

          {/* 우측: 주간 일정 관리 */}
          <Box sx={{ flexGrow: 1 }}>
            <Card elevation={3}>
              <CardHeader
                title="나의 주간 퇴근 시간"
                subheader={`${anchorDate.format("YYYY년 MM월")} (입력한 일정은 모든 그룹에 공유됩니다)`}
                action={
                  <Button variant="contained" size="large" onClick={handleSubmitSchedule} startIcon={<AutoFixHighIcon />}>
                    저장하기
                  </Button>
                }
              />
              <Divider />
              
              {/* 편의 기능 툴바 */}
              <Box sx={{ p: 2, bgcolor: "action.hover", display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTimeIcon fontSize="small" /> 일괄 설정:
                </Typography>
                <TimePicker 
                  value={batchTime} 
                  onChange={(v) => setBatchTime(v)} 
                  slotProps={{ textField: { size: "small", sx: { width: 150, bgcolor: "background.paper" } } }} 
                />
                <Button variant="outlined" size="small" onClick={() => handleBatchApply(true)}>
                  평일만 적용
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleBatchApply(false)}>
                  전체 적용
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button color="error" size="small" onClick={handleClearAll}>
                  초기화
                </Button>
              </Box>

              <CardContent>
                <Box sx={{ 
                  display: "grid", 
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr", lg: "1fr 1fr 1fr 1fr" }, 
                  gap: 2 
                }}>
                  {week.map((d, idx) => {
                    const isWeekend = d.date.day() === 0 || d.date.day() === 6;
                    return (
                      <Paper
                        key={d.date.toString()}
                        variant="outlined"
                        sx={{
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          bgcolor: d.time ? "primary.50" : (isWeekend ? "grey.50" : "background.paper"),
                          borderColor: d.time ? "primary.main" : "divider",
                          position: "relative",
                          transition: "all 0.2s",
                          "&:hover": { borderColor: "primary.main", boxShadow: 1 }
                        }}
                      >
                        <Typography 
                          variant="subtitle1" 
                          gutterBottom 
                          color={isWeekend ? "error.main" : "text.primary"}
                          sx={{ fontWeight: 600 }}
                        >
                          {d.date.format("MM/DD (ddd)")}
                        </Typography>
                        
                        <Box display="flex" alignItems="center" width="100%" mb={1.5}>
                          <TimePicker
                            value={d.time}
                            onChange={(val) => handleTimeChange(idx, val)}
                            minutesStep={30}
                            slotProps={{
                              textField: { size: "small", fullWidth: true, sx: { bgcolor: "background.paper" } },
                            }}
                          />
                          {d.time && (
                            <IconButton size="small" onClick={() => handleRemoveTime(idx)} color="error" sx={{ ml: 0.5 }}>
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>

                        {/* 빠른 선택 칩 */}
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="center">
                          {COMMON_TIMES.map((time) => (
                            <Chip
                              key={time}
                              label={time}
                              size="small"
                              variant={d.time?.format("HH:mm") === time ? "filled" : "outlined"}
                              color={d.time?.format("HH:mm") === time ? "primary" : "default"}
                              onClick={() => handleQuickTime(idx, time)}
                              clickable
                              sx={{ mb: 0.5 }}
                            />
                          ))}
                        </Stack>
                      </Paper>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* 그룹 생성 다이얼로그 */}
        <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
          <DialogTitle>새 그룹 생성</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="그룹 이름"
              fullWidth
              variant="outlined"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreate(false)}>취소</Button>
            <Button onClick={handleCreateGroup} variant="contained">
              생성
            </Button>
          </DialogActions>
        </Dialog>

        {/* 팀원 초대 다이얼로그 */}
        <Dialog open={openInvite} onClose={() => setOpenInvite(false)}>
          <DialogTitle>팀원 초대 ({targetGroup})</DialogTitle>
          <DialogContent>
            <Typography variant="body2" gutterBottom>
              초대할 사용자의 아이디(Username)를 입력하세요.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="사용자 ID"
              fullWidth
              variant="outlined"
              value={inviteUsername}
              onChange={(e) => setInviteUsername(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenInvite(false)}>취소</Button>
            <Button onClick={handleInviteUser} variant="contained">
              초대 보내기
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default SchedulePage;
