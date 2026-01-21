import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  return MySwal.fire({
    title,
    text,
    icon,
    confirmButtonText: '확인',
    confirmButtonColor: '#3085d6', // Matches generic primary color or I can use theme color
  });
};

export default MySwal;
