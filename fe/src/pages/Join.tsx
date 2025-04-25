import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../hooks/api";

const JoinPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      api
        .post("/api/group/join", { token })
        .then(() => {
          alert("그룹 참여 완료!");
          navigate("/group/dashboard");
        })
        .catch((err) => {
          alert("유효하지 않은 초대입니다.");
          navigate("/");
        });
    }
  }, [token]);

  return <div>그룹 참여 중입니다...</div>;
};

export default JoinPage;
