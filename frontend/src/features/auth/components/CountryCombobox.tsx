import { memo, useEffect, useState } from "react";

import { type CountryCallingCode, getCountries, getCountryCallingCode } from "libphonenumber-js";
import { Check, ChevronsUpDown, Globe } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";

export const CountryCombobox = memo(
  ({
    setCallingCode,
  }: {
    setCallingCode: React.Dispatch<React.SetStateAction<CountryCallingCode>>;
  }) => {
    const [open, setOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("Poland");
    // countries ex. - { "Belarus": 375, "Russia": 7 }
    const [countries, setCountries] = useState<Map<string, CountryCallingCode> | null>(null);

    useEffect(() => {
      const regionNamesInEnglish = new Intl.DisplayNames(["en"], {
        type: "region",
      });
      const countryCodes = getCountries();
      const countryToPhoneCodeMap = new Map(
        countryCodes.reduce((acc: [string, CountryCallingCode][], code) => {
          const country = regionNamesInEnglish.of(code);
          if (country) {
            acc.push([country, getCountryCallingCode(code)]);
          }
          return acc;
        }, [])
      );
      setCountries(countryToPhoneCodeMap);
    }, []);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between">
            <Globe /> {selectedCountry} <ChevronsUpDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Select your country" />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries &&
                  Array.from(countries).map(([name, code]) => (
                    <CommandItem
                      key={name}
                      onSelect={() => {
                        setSelectedCountry(name);
                        setCallingCode(code);
                        setOpen(false);
                      }}
                    >
                      <span className="flex items-center justify-between w-full">
                        <span>
                          {name}
                          <span className="text-sm text-muted-foreground">+{code}</span>
                        </span>
                        {selectedCountry === name && <Check className="ml-2" />}
                      </span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
