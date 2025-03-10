import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PersonalInfo from "../_components/user-profile/PersonalInfo";
import PlanUsage from "../_components/user-profile/PlanUsage";
import Billing from "../_components/user-profile/Billing";

const UserProfilePage = async () => {
  const tabsData = [
    { value: "personal", label: "Personal Info" },
    {
      value: "plan",
      label: "Plan & Usage",
    },
    {
      value: "billing",
      label: "Billing & Subscription",
    },
  ];
  return (
    <div className="w-full h-full max-h-screen flex flex-col jutify-center">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        User Profile
      </h1>
      <div className="w-full items-center flex-grow p-4 md:p-4 bg-white rounded-lg shadow">
        <Tabs defaultValue="personal" className="relative mr-auto w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            {tabsData.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="personal">
            <PersonalInfo />
          </TabsContent>
          <TabsContent value="plan">
            <PlanUsage />
          </TabsContent>
          <TabsContent value="billing">
            <Billing />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfilePage;
