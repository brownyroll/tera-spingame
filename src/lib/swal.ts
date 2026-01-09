import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { fireCelebration, fireConfettiFireworks } from "./confetti";

const MySwal = withReactContent(Swal);

export default MySwal;

export const showItemWonAlert = async (
  itemName: string,
  itemImage?: string | null,
) => {
  fireCelebration();

  // Use item image if available, otherwise use default
  const imageUrl =
    itemImage && itemImage.startsWith("data:image")
      ? itemImage
      : "/img/ani-merry.gif";

  return MySwal.fire({
    title: "ของรางวัลที่ได้รับ",
    html: `
      <div style="font-size: 24px; font-weight: bold; color: #2196f3;">
        🎁 ${itemName} 🎁
      </div>
    `,
    // icon: "success",
    imageUrl: imageUrl,
    imageWidth: 300,
    imageHeight: 200,
    confirmButtonText: "🎅 สุ่มผู้โชคดี",
    confirmButtonColor: "#4caf50",
    allowOutsideClick: false,
    allowEscapeKey: false,
    background: "linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)",
    color: "#ffffff",
  });
};

export const showWinnerAlert = async (
  participantName: string,
  itemName: string,
  itemImage?: string | null,
) => {
  // Fire big fireworks for winner
  fireConfettiFireworks();

  // Use item image if available, otherwise use default
  const imageUrl =
    itemImage && itemImage.startsWith("data:image")
      ? itemImage
      : "/img/ani-merry.gif";

  return MySwal.fire({
    title: "🎉 ผู้โชคดี 🎉",
    html: `
      <div style="text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: #ffd700; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
          🎄 ${participantName} 🎄
        </div>
        <div style="font-size: 18px; color: #ffffff;">
          ได้รับ
        </div>
        <div style="font-size: 24px; font-weight: bold; color: #90caf9; margin-top: 10px;">
          🎁 ${itemName} 🎁
        </div>
      </div>
    `,
    // icon: "success",
    imageUrl: imageUrl,
    imageWidth: 300,
    imageHeight: 200,
    confirmButtonText: "🎅 ตกลง 🎅",
    confirmButtonColor: "#c62828",
    allowOutsideClick: false,
    allowEscapeKey: false,
    background: "linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)",
    color: "#ffffff",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.reload();
    }
  });
};

export const showErrorAlert = async (message: string) => {
  return MySwal.fire({
    title: "เกิดข้อผิดพลาด",
    text: message,
    icon: "error",
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#f44336",
  });
};

export const showConfirmDelete = async (itemName: string) => {
  return MySwal.fire({
    title: "ยืนยันการลบ",
    text: `คุณต้องการลบ "${itemName}" ใช่หรือไม่?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ลบ",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#f44336",
    cancelButtonColor: "#9e9e9e",
  });
};

export const showSuccessAlert = async (message: string) => {
  return MySwal.fire({
    title: "สำเร็จ",
    text: message,
    icon: "success",
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#4caf50",
    timer: 2000,
    timerProgressBar: true,
  });
};
