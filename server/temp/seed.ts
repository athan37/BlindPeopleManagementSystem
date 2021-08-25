import { Member, Organization, User  } from "../src/lib/types";
import fs from "fs";
import { connectDatabase } from '../src/database'
import { 
    Gender, 
    Ethnicity, 
    Religion, 
    Occupation, 
    EyeCondition, 
    Education, 
    PostEducation, 
    PoliticalEducation,
    BrailleComprehension,
    Language,
    SupportType,
    IncomeType,
    GovernmentAgencyLevel,
    MarriageStatus
} from "../src/lib/enum";
import { createHashFromUser } from "../src/lib/utils";

 




export const saveData = (members : Member, filename = "members.json") : void => {
    fs.writeFile(filename, JSON.stringify(members), (err) => { //Need stringnify here
        if (err) {
            throw err;
        }
        console.log("Saved data")
    }) 
}

export const loadData = (filename = "members.json") : Member[] => {
    let members : Member[] = [];
    fs.readFile(filename, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }

        members = JSON.parse(data.toString());
    });

    return members;
}

export const users : User[] = [
    {"_id":"112830123241869383734","token":"298ace3bbdcb5f2a48327bf57ce0d364","name":"Anh Than","avatar":"https://lh3.googleusercontent.com/a/AATXAJxi_2t2ID6KZBEDMGJ9tCCA_5KncNtf6v1hAhwo=s100","contact":"athan@bates.edu","isAdmin":true},
    {"_id":"115147470592336775121","token":"c9bf5d38aa794e7cbdc1dc130705e932","name":"Văn Ngáo Nguyễn","avatar":"https://lh3.googleusercontent.com/a-/AOh14GgbwOMDsJ21KYB26DIbk25MLMmYzJlwPjvs-_gn=s100","contact":"vanngao09@gmail.com","isAdmin":false,"registering":false,"organization_id":"CầuTiêu"},
    {"_id":"107589725800820759904","token":"567607039bdd37834da8811139b5030c","name":"Royale Clash","avatar":"https://lh3.googleusercontent.com/a/AATXAJwl0WM6RpTdoIFjvzC4QBONMMrMAPmCntlItEPe=s100","contact":"clashroyale.singapore@gmail.com","isAdmin":false,"registering":false,"organization_id":"Maidịch"},
    {"_id":"110033170455996289118","token":"6d4404643642c2dd68201c2bf5a3f350","name":"than thang","avatar":"https://lh3.googleusercontent.com/a/AATXAJwlhFa6B4fuevt92NIMpfRTjJQMDEl3Jm6JdapY=s100","contact":"cloneel0002@gmail.com","isAdmin":false,"registering":false,"organization_id":"MaiTyson"}
];

export const organizations : Organization[] = [
    {"_id":"ThanhXuân", "name": "Thanh Xuân"},
    {"_id":"LongBiên", "name": "Long Biên"},
    {"_id":"TânBình", "name": "Tân Bình"},
    {"_id":"CầuGiấy", "name": "Cầu Giấy"},
];

const generateMembers = ( num : number) =>  {
    const members : Member[] = []

    const randomChoice = (arr : any[]) => arr[Math.floor(Math.random() * arr.length)]
    const getRandomIntInclusive = (min : number, max : number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
      }


    for (let index = 0; index <= num; index++) {
        // const i = `${index}`
        const obj = {
            lastName : randomChoice([
              "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý",
              "Ân", "Bạch", "Bành", "Bao", "Biên", "Biện", "Cam", "Cảnh", "Cảnh", "Cao", "Cái", "Cát", "Chân", "Châu", "Chiêm", "Chu", "Chung", "Chử", "Cổ", 
              "Cù", "Cung", "Cung", "Củng", "Cừu", "Dịch", "Diệp", "Doãn", "Dũ", "Dung", "Dư", "Dữu", "Đái", "Đàm", "Đào", "Đậu", "Điền", "Đinh", "Đoàn", "Đồ", 
              "Đồng", "Đổng", "Đường", "Giả", "Giải", "Gia Cát ", "Giản", "Giang", "Giáp", "Hà", "Hạ", "Hậ", "Hác", "Hàn", "Hầu", "Hình", "Hoa", "Hoắc", "Hoạn", 
              "Hồng", "Hứa", "Hướng", "Hy", "Kha", "Khâu", "Khổng", "Khuất", "Kiều", "Kim", "Kỳ", "Kỷ", "La", "Lạc", "Lai", "Lam", "Lăng", "Lãnh", "Lâm", "Lận", 
              "Lệ", "Liên", "Liêu", "Liễu", "Long", "Lôi", "Lục", "Lư", "Lữ", "Lương", "Lưu", "Mã", "Mạc", "Mạch", "Mai", "Mạnh", "Mao", "Mẫn", "Miêu", "Minh", 
              "Mông", "Ngân", "Nghê", "Nghiêm", "Ngư", "Ngưu", "Nhạc", "Nhan", "Nhâm", "Nhiếp", "Nhiều", "Nhung", "Ninh", "Nông", "Ôn", "Ổn", "Ông", "Phí", "Phó", 
              "Phong", "Phòng", "Phù", "Phùng", "Phương", "Quách", "Quan", "Quản", "Quang", "Quảng", "Quế", "Quyền", "Sài", "Sầm", "Sử", "Tạ", "Tào", "Tăng", 
              "Tân", "Tần", "Tất", "Tề", "Thạch", "Thai", "Thái", "Thang", "Thành", "Thảo", "Thân", "Thi", "Thích", "Thiện", "Thiệu", "Thôi", "Thủy", "Thư", "Thường", 
              "Tiền", "Tiết", "Tiêu", "Tiêu", "Tô", "Tôn", "Tôn Thất", "Tông", "Tống", "Trác", "Trạch", "Trại", "Trang", "Trầm", "Trâu", "Trì", "Triệu", "Trịnh", 
              "Trương", "Từ", "Tư Mã", "Tưởng", "Úc", "Ứng", "Vạn", "Văn", "Vân", "Vi", "Vĩnh", "Vũ", "Vũ Văn", "Vương", "Vưu", "Xà", "Xầm", "Xế", "Yên", 
            ]),
            firstName : randomChoice([
                "Bảo Vy", "Cát Tường", "Gia Hân", "Hoài An", "Khả Hân", "Khánh Ngọc", "Khánh Ngân", "Linh Chi", "Ngọc Khuê", "Phúc An", "Thanh Hà", "Bích Hà", 
                "Thanh Thúy", "An Ngọc", "Khánh Châu", "Kim Ngân", "Tuyết Nhung", "Yến Nhi", "Vân Khánh", "An Diệp", "Cát Anh", "Cẩm Anh", "An Nhiên", "Quỳnh Anh", 
                "Phương Linh", "Hoài Thương", "Thiên Bình", "Thanh Thảo", "Hiền Châu", "Mai Ngọc", "Hồng Diễm", "Bích Thảo", "Bích Thủy", "Ðoan Trang", "Đan Tâm", 
                "Hiền Nhi", "Hiền Thục", "Hương Thảo", "Minh Tâm", "Mỹ Tâm", "Phương Thùy", "Phương Trinh", "Nhã Phương", "Phương Thảo", "Thanh Mai", "Thảo Chi", 
                "Thiên Thanh", "Thục Quyên", "Thục Trinh", "Hương Chi", "Mỹ Dung", "Lan Hương", "Mỹ Lệ", "Cát Tiên", "Anh Thư", "Thanh Tú", "Tú Vi", "Hạ Vũ", 
                "Mộc Miên", "Hoài Phương", "Bảo Quyên", "Bích Liên", "Diễm Châu", "Diễm My", "Diễm Kiều", "Diễm Phương", "Diễm Thảo", "Đông Nghi", "Đan Thanh", 
                "Gia Mỹ", "Huyền Anh", "Hồng Nhung", "Kim Liên", "Kim Oanh", "Khánh Quỳnh", "Mỹ Duyên", "Ngọc Bích", "Ngọc Hoa", "Ngọc Diệp", "Ngọc Mai", "Ngọc Trâm", 
                "Nguyệt Minh", "Nguyệt Ánh", "Quỳnh Chi", "Quỳnh Hương", "Quỳnh Nhi", "Tú Linh", "Thu Nguyệt", "Thanh Vân", "Thanh Trúc", "Vân Trang", "Kim Chi", 
                "Tố Như", "Diệp Bích", "Mỹ Ngọc", "Ngọc Hạ", "Tố Nga", "Uyên Thư", "Bảo Thanh", "Nhã Linh", "Gia Linh", "Mẫn Nhi", "Minh Nguyệt", "Minh Khuê", "Minh Tuệ", 
                "Như Ý", "Tú Uyên", "Tuệ Mẫn", "Tuệ Lâm", "Tuyết Lan", "Tuệ Nhi", "Tú Anh", "Thùy Anh", "Minh Anh", "An Chi", "Hải Yến", "Thảo Phương", "Hương Tràm", 
                "Lệ Hằng", "Ái Phương", "An Bảo", "An Du", "An Đức", "An Cường", "An Chí", "An Hòa", "An Khánh", "An Khang", "An Lộc", "An Mạnh", "An Phú", "An Uy",
                "An Tú", "An Thiện", "Anh Duy", "Anh Đức", "Anh Hào", "Anh Huy", "Anh Khôi", "Anh Khoa", "Anh Minh", "Anh Quân", "Anh Quốc", "Anh Sơn", "Anh Phong",
                "Anh Tú", "Anh Vũ", "Anh Vĩnh", "Anh Vương", "Minh Danh", "Minh Dương", "Minh Đức", "Minh Hào", "Minh Hùng", "Minh Hoạt", "Minh Hưng", "Minh Hậu",
                "Minh Hải", "Minh Giáp", "Minh Quân", "Khánh Ân", "Khánh Duy", "Khánh Đăng", "Khánh Đức", "Khánh Gia", "Khánh Khoa", "Khánh Mạnh", "Khánh Phúc",
                "Khánh Phi", "Khánh Thường", "Hải Anh", "Hải Bằng", "Hải Bình", "Hải Long", "Hải Lưu", "Hải Minh", "Hải Ngọc", "Hải Phong", "Hải Quang", "Hải Quốc",
                "Hải Sơn", "Hải Thường", "Hải Trí", "Gia An", "Gia Ân", "Gia Bảo", "Gia Cường", "Gia Hòa", "Gia Huy", "Gia Hưng", "Gia Hiếu", "Gia Minh", "Gia Nguyên",
                "Gia Đức", "Gia Khánh", "Gia Khải", "Gia Khoa", "Gia Phúc", "Gia Vinh", "Gia Vĩ", "Bảo Khánh", "Tùng Quân", "Mạnh Hùng", "Hiền Minh", "Khang Kiện",
                "Khôi Nguyên", "Mạnh Hùng", "Thành Công", "Trung Dũng", "Thiên Ân", "Thành Đạt", "Tài Đức", "Tuấn Kiệt", "Thanh Liêm", "Trọng Nhân", "Thanh Tùng",
                "Thái Sơn", "Thiện Tâm", "Quang Dũng", "Tuấn Tú",
            ]),
            birthYear: getRandomIntInclusive(1930, 2010),
            gender : randomChoice(Object.keys(Gender)),
            address : "Hanoi",
            ethnicity : randomChoice(Object.keys(Ethnicity)),
            religion : randomChoice(Object.keys(Religion)),
            occupation : randomChoice(Object.keys(Occupation)),
            isCommunistPartisan : randomChoice([true, false]), 
            marriage : randomChoice(Object.keys(MarriageStatus)), 
            eyeCondition : randomChoice(Object.keys(EyeCondition)),
            education : randomChoice(Object.keys(Education)),
            postEducation : randomChoice(Object.keys(PostEducation)),
            politicalEducation : randomChoice(Object.keys(PoliticalEducation)),
            brailleComprehension : randomChoice(Object.keys(BrailleComprehension)),
            governmentAgencyLevel : randomChoice(Object.keys(GovernmentAgencyLevel)),
            languages : (() => {
                const length = getRandomIntInclusive(1, 5 + 1)
                const set    = new Set();

                let j = 0;
                while (j < length) {
                    set.add(randomChoice(Object.keys(Language)))
                    j++;
                }

                return Array.from(set)
            })(),
            familiarWIT : randomChoice([true, false]),
            healthInsuranceCard : randomChoice([true, false]),
            disabilityCert : randomChoice([true, false]),
            busCard: randomChoice([true, false]),
            supportType : randomChoice(Object.keys(SupportType)),
            incomeType : randomChoice(Object.keys(IncomeType)),
            blindManageCert: randomChoice([true, false]),
            socialWorkLevel: randomChoice(Object.keys(PostEducation)),
            organization_id: randomChoice(
               organizations.map(organization => organization._id) 
            )
        }

        const hash = createHashFromUser(obj);
        obj["_id"] = hash
        
        //@ts-expect-error already added it
        members.push(obj)

    }

    return members;
}

const seed = async () => {
    try { 
        console.log('[seed] : running...');

        const db = await connectDatabase();

        for (const member of generateMembers(100)) {
            await db.members.insertOne(member);
        }

        //Comment this at the moment, the token is not guaranteed to be newest
        // for (const user of users) {
        //     await db.users.insertOne(user);
        // }


        // for (const organization of organizations ) {
        //     await db.organizations.insertOne(organization);
        // }

        // db.members.createIndex({ 
        //     lastName: "text",
        //     firstName: "text",
        //     birthYear: "text",
        //     address: "text"})

        console.log('[seed] : completed') ;
    } catch {
        throw new Error("failed to seed db");
    }
}
seed()
