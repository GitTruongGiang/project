# airplane booking

## mô tả

## fontend feature

## backend feature

### user addmin

- tạo hãng máy bay, chuyến bay
- kiểm tra được thông tin chuyến bay như (người đặt chuyến bay)

### user information

- tạo thông tin người dùng (email, pasword, sdt,mã chuyến bay, số chổ ngồi(count))
- nếu người dùng đặt chuyến bay mà k co tk đăng nhập thì cần email, ,sdt và thông tin booking (cool feature)

### booking

- nếu người dùng đặt chuyến bay mà có tk đăng nhập thì lấy thông tin từ tk rồi push thêm thông tin booking
- tạo booking:
  - userID
  - flightID
  - status
- người dùng chọn ngày bay trước 1 tháng
- người dùng có thể cancel chuyến bay trước 1 ngày, và hoàn 80% tiền chuyến bay

## models

### user addmin

- create
  - create user addmin
    - status: addmin
  - create airlines
  - create ariplane flight
    - contain 30 chair
- status ariplane flight
  - [pending, accepted, done]

### user infomation

- name, email, password, sdt
- isdeleted
-

### booking

- author: User
- cccd
- flight
- number chair
- price booking
- status: { }
- địa điểm xuất phát và địa điểm hạ cánh
- số chổ ngồi của máy bay hiện tại còn chỗ
- thời gian xuất phát chuyến bay máy bay
- thanh toán thông qua thẻ

### flight

- airlines
- plane
- from ( HCM )
- to ( DN )
- time from
- time to
- price / 1 User: { type: number, required: true }
  <!-- - signed luggage: { type: number, defaul: 7kg } -->
  <!-- - ratings -->
- user booking count: { type: string, defaul: number }
- status: { type: string, }

### arilines

- name: { type: "String", required: true, enum: [ "Vietnam Airlines", "Vietjet Air", "Jetstar Pacific Airlines", "Bamboo Airways" ] ] }
- planes: [ planeId ]
- count plane: { type: string, defaul: number }

### plane

- name plane: {type: String, required: true}
- mã số hiệu plane: { type: String, required: true }
- authorAirlines: { arilinesId }
- chair count: number
<!-- - cabin count: { type: string, defaul: number } -->

<!-- ### cabin
- name: { type: String, required: true }
- authorPlane: { planeId }
- chair count : { type: string, defaul: 30 } -->

### chair

- indexSeat: { type: number, required: true }
- flight
- status: { type: String, required: true, enum: [ "none", "place" ] }
