import AddFriendModal from "../components/AddFriendModal";

export default function AccountRoom({conn}) {
    return (
        <main className="w-full overflow-hidden flex flex-col">
            <section className="bg-[#fff] container__26baa">
                <div className="flex flex-1">
                    <div className="relative flex-auto flex items-center min-w-[0px] overflow-hidden">
                        <div className="relative h-[24px] w-auto mx-[8px]" style={{flex: "0 0 auto"}}>
                            <svg x="0" y="0" class="block w-[24px] h-[24px]" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M13 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" class=""></path><path fill="currentColor" d="M3 5v-.75C3 3.56 3.56 3 4.25 3s1.24.56 1.33 1.25C6.12 8.65 9.46 12 13 12h1a8 8 0 0 1 8 8 2 2 0 0 1-2 2 .21.21 0 0 1-.2-.15 7.65 7.65 0 0 0-1.32-2.3c-.15-.2-.42-.06-.39.17l.25 2c.02.15-.1.28-.25.28H9a2 2 0 0 1-2-2v-2.22c0-1.57-.67-3.05-1.53-4.37A15.85 15.85 0 0 1 3 5Z" class=""></path></svg>
                        </div>
                        <div className=" mr-[8px] min-w-[auto]" style={{flex: "0 0 auto"}}>
                            <h1 className="text-base font-semibold">Bạn bè</h1>
                        </div>
                        <div className="w-[1px] h-[24px] my-[8px] bg-[#EBEBED]" style={{flex: "0 0 auto"}}></div>
                        <div className="flex">
                            <div className="item__48dda topPill__63ad4 tabBar__73938 text-[#fff] bg-[#248146]">
                                <span>Thêm Bạn</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="h-full flex relative overflow-hidden">
                <div className="flex flex-col flex-auto overflow-hidden">
                    <AddFriendModal/>
                </div>
            </div>
        </main>
    )
}