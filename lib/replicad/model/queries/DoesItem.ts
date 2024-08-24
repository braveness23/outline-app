import { forModelData } from "../ForModelData";
import Item from "../Item";
import ItemGroup from "../item/ItemGroup";
import ItemType from "../ItemType";
import ModelData from "../ModelData";

const doesItemFor = (data: ModelData) => {
  return (itemId: string) => {
    return {
      haveSameParentsAs: (otherId?: string) => {
        if (otherId) {
          const parentId = forModelData(data).findParentId(itemId);
          const previousParentId = forModelData(data).findParentId(otherId);
          return parentId == previousParentId;
        }
        return false;
      },
      haveNestedSibling: (otherId?: string) => {
        const parentId = forModelData(data).findParentId(itemId);
        if (parentId) {
          if (otherId) {
            const parent = forModelData(data).getById(parentId) as ItemGroup;
            const sibling = forModelData({ items: parent.items }).findById(
              otherId
            );
            return !!sibling;
          } else {
            return false;
          }
        } else {
          // Root elements
          return true;
        }
      },
      hasChild: (otherId?: string): boolean => {
        const checkItems = (items: Item[]): boolean => {
          if (items.some((it) => it.id == otherId)) {
            return true;
          } else {
            const subGroups = items.filter((it) => it.type == ItemType.Group);
            for (const group of subGroups) {
              const result = checkItems(group.items);
              if (result) return true;
            }
          }
          return false;
        };

        const item = forModelData(data).getById(itemId);
        if (item.type == ItemType.Group) {
          return checkItems(item.items);
        } else {
          // Root elements
          return false;
        }
      },
    };
  };
};

export default doesItemFor;
