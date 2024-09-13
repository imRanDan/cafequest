import { Flex, Input, Stack } from '@chakra-ui/react'
import React from 'react'

const SearchBar = () => {
  return (
    <Flex justifyContent={"center"} alignContent={"center"}>
        <Input htmlSize={48} width='auto' height='auto' variant='outline' />
    </Flex>
  )
}

export default SearchBar