import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';
import { Nav, NavButtonLink } from './nav';

/**
 * Props for NestedAccordianNav component
 */
export interface NestedNavigationProps {
  title: string;
  id: string;
  disabled?: boolean;
  children: NavButtonLink[];
  icon?: string;
}

export const NestedAccordianNav: React.FC<{
  data: NestedNavigationProps[];
  onLinkClicked?: (link: NavButtonLink) => void;
  filterText?: string;
}> = ({ data, onLinkClicked, filterText }) => {
  const state = useParams();
  const checkDefaultExpandValue = () => {
    const foundParent: string[] = [];
    if (data && data.length) {
      const searchTextLowerCase = filterText ? filterText.toLowerCase() : '';

      for (const parentItem of data) {
        if (!parentItem.children) {
          continue;
        }
        const foundChild = parentItem.children.find((childItem) => {
          const titleLowerCase = childItem.title.toLowerCase();
          const hasSearchText =
            searchTextLowerCase && titleLowerCase.includes(searchTextLowerCase);
          const hasTemplateId =
            state?.templateId && childItem.href.includes(state.templateId);

          return hasSearchText || hasTemplateId;
        });
        if (foundChild) {
          foundParent.push(parentItem.id);
        }
      }
      return foundParent;
    }
  };
  if (!data || !data.length) return null;
  return (
    <div className="flex-none md:w-64 lg:w-96">
      {data.map((sideNavData: NestedNavigationProps) => (
        <Accordion
          key={sideNavData.id}
          type="multiple"
          defaultValue={checkDefaultExpandValue()}>
          <AccordionItem className="w-100" value={sideNavData.id}>
            <AccordionTrigger className="mr-4 flex pl-4 text-xl font-extrabold">
              {sideNavData.title}
            </AccordionTrigger>
            <AccordionContent className="bg-accent pb-0">
              <Nav
                isCollapsed={false}
                onLinkClicked={onLinkClicked}
                links={sideNavData.children}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};
