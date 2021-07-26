import { Divider } from "antd";
//https://www.google.com/search?q=404+icon+white&tbm=isch&ved=2ahUKEwiotO72_f7xAhUQBpQKHcVhAO8Q2-cCegQIABAA&oq=404+icon+white&gs_lcp=CgNpbWcQA1DIXlijYmCYY2gAcAB4AIABTogB5gKSAQE1mAEAoAEBqgELZ3dzLXdpei1pbWfAAQE&sclient=img&ei=Nb_9YOjFFJCM0ATFw4H4Dg&bih=937&biw=1920#imgrc=Tg6cEqGPioH4EM
import errImg from "./assets/error-404.png";

export const NotFound = () => {
    return <div className="pending__container">
        <div className="pending__text-container">
            <h1>Link không tồn tại</h1>
            <h3>Không thể tìm được đường link, xin vui lòng nhập đúng url</h3>
            <Divider />
            <img  width={300}
            src={errImg} alt="Anh thể hiện trang không vào được"/>

        </div>
    </div>
}