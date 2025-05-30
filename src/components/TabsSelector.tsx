import { useSwipeable } from "react-swipeable";

interface TabsSelectorProps {
  selectedTab: string;
  onSelectTab: (tab: string) => void;
}

const TabsSelector = ({ selectedTab, onSelectTab }: TabsSelectorProps) => {
  const tabs = ["All","Pending", "In Progress", "Completed"];

  const currentIndex = tabs.indexOf(selectedTab);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < tabs.length - 1) {
        onSelectTab(tabs[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        onSelectTab(tabs[currentIndex - 1]);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true, // opcional: permite swipe con mouse también
  });

  return (
    <div {...handlers} className="flex space-x-4 mb-8">
      {tabs.map((tab) => {
        const isActive = selectedTab === tab;

        return (
          <button
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={`px-6 py-2 rounded-full font-medium transition ${
              isActive
                ? "bg-[#ffbc0d] text-black"
                : "bg-[#f9f9f9] text-gray-600 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

export default TabsSelector;
