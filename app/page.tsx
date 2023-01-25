'use client';
import React, {
  useState,
  useEffect,
  ReactEventHandler,
  ChangeEvent,
} from 'react';
import Loader from './loading';
import { Card, FormField } from './[components]';

interface props {
  data: any;
  title: string;
}
const RenderCards = ({ data, title }: props) => {
  if (data?.length > 0)
    return data.map((post: any) => <Card key={post._id} {...post} />);

  return (
    <h2 className="mt-5 text-xl font-bold uppercase text-[#6449ff]">{title}</h2>
  );
};

export default function Page() {
  const [connected, setConnected] = useState(false);
  const [searchedResults, setSearchedResults] = useState<string[]>();
  const [searchTimeout, setSearchTimeout] = useState<any>(null);
  const [allPosts, setAllPosts] = useState<string[]>();
  const [loading, setloading] = useState(false);
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    const fetchPosts = async () => {
      setloading(true);
      try {
        const response = await fetch('api/postRoutes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const result = await response.json();
          setAllPosts(result.data.reverse());
        }
      } catch (err) {
        alert(err);
      } finally {
        setloading(false);
      }
    };

    fetchPosts();
    return () => {};
  }, []);
  const handleSearchChange = (e: ChangeEvent) => {
    clearTimeout(searchTimeout);
    const target = e.target as HTMLInputElement;
    setSearchText(target?.value);
    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts!.filter(
          (item: any) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase()),
        );
        setSearchedResults(searchResults);
      }, 500),
    );
  };
  return (
    <section className="mx-auto max-w-7xl">
      <div>
        <h1 className="text-[32px] font-extrabold text-[#222328]">
          The Community Showcase
        </h1>
        <p className="mt-2 max-w-[500px] text-[14px] text-[#666e75]">
          Browse through a colection of imaginative and visually stunning images
          generated by DALL-E AI
        </p>
      </div>
      <div className="mt-16">
        <FormField
          labelname="Search posts"
          type="text"
          name="text"
          placeholder="Search posts..."
          handleChange={handleSearchChange}
          value={searchText}
          isSupriseMe={false}
          handleSupriseMe={() => {}}
        />
      </div>
      <div className="mt-10">
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="mb-3 text-xl font-medium text-[#666e75]">
                Showing results for{' '}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="xs:grid-cols-2 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title="No Search results found"
                />
              ) : (
                <RenderCards data={allPosts} title="No posts found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
