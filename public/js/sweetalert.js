
function confirm(id) {
    Swal.fire({
        title: 'คุณต้องการอนุมัติ ?',
        text: "เมื่อกดอนุมัติไปแล้วไม่สามารถย้อนกลับได้!!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location = '/disbursement/adminConfirm/'+id
        }
    })
}
function cancal(id) {
    Swal.fire({
        title: 'คุณต้องการยกเลิก ?',
        text: "เมื่อกดยกเลิกไปแล้วไม่สามารถย้อนกลับได้!!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ยืนยัน'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location = '/disbursement/adminCancel/'+id
        }
    })
}

function defaultpass(id) {
    Swal.fire({
        title: 'ต้องการรีเซ็คพาสเวิร์ดใช่หรือไม่ ?',
        text: "เมื่อกดยืนยันไปแล้วไม่สามารถย้อนกลับได้ !!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ยืนยัน'
    }).then((result) => {
        if (result.isConfirmed) {
            
            window.location = '/users/default-password/'+id
        }
    })
}


