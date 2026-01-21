import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../hooks/api";
import { showAlert } from "../utils/swal";

const JoinPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      api
        .post("/api/group/join", { token })
        .then(async () => {
          await showAlert("참여 완료", "그룹 참여 완료!", "success");
          navigate("/schedule");
        })
        .catch(async (err) => {
          await showAlert("오류", "유효하지 않은 초대입니다.", "error");
          navigate("/");
        });
    }
  }, [token]);

  return <div>그룹 참여 중입니다...</div>;
};

export default JoinPage;
