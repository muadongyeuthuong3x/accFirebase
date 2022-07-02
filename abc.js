#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <conio.h>

typedef struct
{
	char hoTen[25];
	int tuoi;
	float diemTB;
}SinhVien;


SinhVien nhapDuLieuSinhVien()
{
	SinhVien sv;
	printf("\tNhap ten: ");
	fflush(stdin);
	gets(sv.hoTen);

	printf("\tNhap tuoi: ");
	fflush(stdin);
	scanf("%d",&sv.tuoi);

	printf("\tNhap diem: ");
	fflush(stdin);
	scanf("%f",&sv.diemTB);

	return sv;
}

typedef struct node
{
    SinhVien data;
    struct node* next;
} Node;

Node* first = NULL;

//Cap phat node
Node* capPhatNode()
{
    Node* pNode = (Node*)malloc(sizeof(Node));
    if (pNode==NULL)
    {
        printf("Khong du bo nho cap phat\n");
        return NULL;
    }
    return pNode;
}

//Tao node
Node* taoNode(SinhVien sv)
{
    Node* pNode = capPhatNode();
    if (pNode!=NULL)
    {
        pNode->data = sv;
        pNode->next = NULL;
    }
    return pNode;
}
//Tao va nhap node
Node* taoVaNhapNode()
{
    SinhVien sv =nhapDuLieuSinhVien();
    Node* pNode = taoNode(sv);
    return pNode;
}

//Them node dau
void themNodeViTriDau(SinhVien sv)
{
    Node* pNode = taoNode(sv);
    if(pNode==NULL)
        return;
    pNode->next = first;
    first = pNode;
}
//Them va nhap node dau
void themvaNhapNodeViTriDau()
{
    SinhVien sv=nhapDuLieuSinhVien();
    themNodeViTriDau(sv);
}

//Tim node cuoi
Node* timNodeCuoi()
{
    if (first==NULL)
        return NULL;
    Node* i=first;
    while (i->next!=NULL)
    {
        i = i->next;
    }
    return i;
}
//Them node cuoi
void themNodeViTriCuoi(SinhVien sv)
{
    if (first==NULL)
    {
        themNodeViTriDau(sv);
    }
    else
    {
        Node* pNode = taoNode(sv);
        Node* lastNode = timNodeCuoi();
        pNode->next = NULL;
        lastNode->next = pNode;
    }
}
//Them va nhap node cuoi
void themVaNhapNodeViTriCuoi()
{
    SinhVien sv =nhapDuLieuSinhVien();
    themNodeViTriCuoi(sv);
}

//Sua
Node* timNodeTheoTen (char* ht)
{
    for (Node* i=first; i!=NULL; i=i->next)
    {
        if (strcmp(i->data.hoTen,ht)==0)
            return i;
    }
    return NULL;
}
void suaNode (Node* pNode)
{
    if (pNode==NULL)
        return 0;
    pNode->data = nhapDuLieuSinhVien();
}
//Chen
void themPNodeSauQNode(Node* qNode, Node* pNode)
{
    if (qNode==NULL||pNode==NULL)
        return;
    pNode->next = qNode->next;
    qNode->next = pNode;
}
//Xoa

void xoaNode (Node* delNode)
{
    if (delNode==NULL)
        return 0;
    if (delNode==first)
    {
        first = first->next;
        free(delNode);
    }
    else
    {
        //Tim delNode
        Node* i = first;
        while (i->next!=delNode)
            i = i->next;

        //Dieu huong
        i->next = delNode->next;
        free(delNode);
    }
}
//Xoá cac node theo ten
void xoaTatCaNodeTheoTen(char* ht)
{
    while (1)
    {
        Node* delNode = timNodeTheoTen(ht);
        if (delNode==NULL)
            break;
        xoaNode(delNode);
    }
}

//Xoa ds
void xoaDanhSach()
{
    while (first!=NULL)
    {
        xoaNode(first);
    }
}


void hienThiSinhVienDangBang(SinhVien sv)
{
    printf("%25s%10d%10.2f\n",sv.hoTen,sv.tuoi,sv.diemTB);
}

//Hiển thị danh sách
void hienThiDanhSach()
{
    printf("\t\tDANH SACH SINH VIEN\n");
    printf("\t%5s%25s%10s%10s\n","STT","HO TEN","TUOI","DIEM TB");
    int stt = 1;
    for (Node* i=first; i!=NULL; i=i->next)
    {
        printf("\t%5d",stt++);
        hienThiSinhVienDangBang(i->data);
    }
}
int menu()
{
    int chon;
	printf("\t\tMENU\n");
	printf("\t1. Tao danh sach sinh vien\n");
	printf("\t2. Hien thi danh sach sinh vien\n");
	printf("\t3. Them sinh vien theo ten\n");
	printf("\t4. Xoa mot sinh vien\n");
	printf("\t5. Sua mot sinh vien\n");
	printf("\t6. Ket thuc\n");
	printf("\t->>Vui long chon: ");
	scanf("%d",&chon);
	return chon;
}


void main()
{
	while (1)
	{
        int chon = menu();
		system("cls");
		switch (chon)
		{
			case 1:
            {

                xoaDanhSach();
                printf("\tNhap so luong phan tu: ");
                int n;
                scanf("%d",&n);
                while(n--)
                {
                    themVaNhapNodeViTriCuoi();
                }
                printf("\tNhap xong\n");
                break;
            }
			case 2:
            {
                hienThiDanhSach();
                printf("\n");
                break;
            }

			case 3:
            {
                char ht[25];
                printf("\tNhap ten can tim:");
                fflush(stdin);
                gets(ht);

                Node* qNode = timNodeTheoTen(ht);
                if(qNode!=NULL)
                {
                    Node* pNode = taoVaNhapNode();
                    themPNodeSauQNode(qNode,pNode);
                    printf("\n\tChen xong!!\n");
                    break;
                }
                else
                {
                    printf("Sinh vien khong co trong danh sach!!");
                    break;
                }
            }

            case 4:
            {
                char ht[25];
                printf("\tNhap ten SV muon xoa:");
                fflush(stdin);
                gets(ht);

                Node* pNode = timNodeTheoTen(ht);
                if(pNode!=NULL)
                {
                    xoaNode(pNode);
                    printf("\n\Xoa xong!!\n");
                    break;

                }else
                {
                    printf("Sinh vien khong co trong danh sach!!");
                    break;
                }

            }

			case 5:
            {
                char ht[25];
                printf("\tNhap ten SV can sua:");
                fflush(stdin);
                gets(ht);

                Node* pNode = timNodeTheoTen(ht);
                if(pNode!=NULL)
                {
                    suaNode(pNode);
                    printf("\n\Sua xong!!\n");
                    break;
                }else
                {
                    printf("Sinh vien khong co trong danh sach!!");
                    break;
                }

            }

			case 6:
            {
                printf("\tBYE\n");
                return;

            }
			default:
				printf("\tVui long nhap lai!!!\n");
		}
		printf("\n\tNhap phim bat ki de ve menu\n");
		getch();
		system("cls");
	}
}